const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI ;
const locationLogIntervalMs = Number(process.env.LOCATION_LOG_INTERVAL_MS) || 30000;

app.use(cors());
app.use(express.json());

const tripSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      required: true,
      trim: true,
    },
  
    status: {
      type: String,
      enum: ['ACTIVE', 'ENDED'],
      default: 'ACTIVE',
      index: true,
    },
    source: {
    type: String,
    required: true,
    trim: true,
    index: true // Indexing for faster search
  },
  destination: {
    type: String,
    required: true,
    trim: true,
    index: true // Indexing for faster search
  },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator(value) {
            return (
              Array.isArray(value) &&
              value.length === 2 &&
              value.every((coordinate) => Number.isFinite(coordinate))
            );
          },
          message: 'coordinates must be [longitude, latitude]',
        },
      },
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    speed:{
      type: Number,
      min: 0,
    }
  },
  {
    versionKey: false,
  }
);

tripSchema.index({ currentLocation: '2dsphere' });
tripSchema.index(
  { busId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'ACTIVE' },
  }
);

const tripLocationLogSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    busId: {
      type: String,
      required: true,
      trim: true,
    },
   
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    
    capturedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

tripLocationLogSchema.index({ location: '2dsphere' });

const Trip = mongoose.model('Trip', tripSchema);
const TripLocationLog = mongoose.model('TripLocationLog', tripLocationLogSchema);

function isValidCoordinatePair(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }

  const [longitude, latitude] = coordinates;

  return (
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

function parseLocation(body) {
  const coordinates = body.coordinates || body.currentLocation?.coordinates;

  if (!isValidCoordinatePair(coordinates)) {
    return null;
  }

  return {
    type: 'Point',
    coordinates,
  };
}

function parseSeatAvailability(value) {
  if (!Number.isInteger(value) || value < 0) {
    return null;
  }

  return value;
}

function handleError(res, error) {
  if (error?.code === 11000) {
    return res.status(409).json({
      error: 'An active trip already exists for this bus.',
    });
  }

  console.error(error);

  return res.status(500).json({
    error: 'Internal server error',
  });
}

app.get('/', (req, res) => {
  res.json({
    service: 'Where Is My Bus Driver API',
    status: 'ok',
  });
});

app.post('/api/trips/start', async (req, res) => {
  try {
    const {
      busId,
      startTime,
      source,
      destination,
    } = req.body;

    const location = parseLocation(req.body);
   

    if (!busId || !location === null) {
      return res.status(400).json({
        error:
          'busId and coordinates are required to start a trip.',
      });
    }

    const now = new Date();

    const trip = await Trip.create({
      busId,
      status: 'ACTIVE',
      source,
      destination,
      currentLocation: location,
      startTime: startTime ? new Date(startTime) : now,
      lastUpdated: now,
      lastLocationLogAt: now,
    });

    await TripLocationLog.create({
      tripId: trip._id,
      busId: trip.busId,
      source: trip.source,
      destination: trip.destination,
      location,
      
      capturedAt: now,
    });

    return res.status(201).json({
      message: 'Trip started successfully.',
      trip,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

app.patch('/api/trips/update-logs', async (req, res) => {
  try {
    const { tripId, busId} = req.body;
    const location = parseLocation(req.body);
   

    if ((!tripId && !busId) || !location=== null) {
      return res.status(400).json({
        error:
          'Provide tripId or busId along with seatAvailability and coordinates for trip updates.',
      });
    }

    const query = tripId ? { _id: tripId, status: 'ACTIVE' } : { busId, status: 'ACTIVE' };
    const now = new Date();

    const trip = await Trip.findOne(query);

    if (!trip) {
      return res.status(404).json({
        error: 'Active trip not found.',
      });
    }

    trip.currentLocation = location;
   
    trip.lastUpdated = now;

    const shouldPersistLog =
      !trip.lastLocationLogAt || now.getTime() - trip.lastLocationLogAt.getTime() >= locationLogIntervalMs;

    if (shouldPersistLog) {
      trip.lastLocationLogAt = now;
    }

    await trip.save();

    if (shouldPersistLog) {
      await TripLocationLog.create({
        tripId: trip._id,
        busId: trip.busId,
       
        location,
        
        capturedAt: now,
      });
    }

    return res.status(200).json({
      message: 'Trip update accepted.',
      tripId: trip._id,
      logPersisted: shouldPersistLog,
      lastUpdated: trip.lastUpdated,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

app.post('/api/trips/end', async (req, res) => {
  try {
    const { tripId, busId } = req.body;

    if (!tripId && !busId) {
      return res.status(400).json({
        error: 'Provide tripId or busId to end a trip.',
      });
    }

    const query = tripId ? { _id: tripId, status: 'ACTIVE' } : { busId, status: 'ACTIVE' };
    const now = new Date();

    const trip = await Trip.findOneAndUpdate(
      query,
      {
        $set: {
          status: 'ENDED',
          endTime: now,
          lastUpdated: now,
        },
      },
      {
        new: true,
      }
    );

    if (!trip) {
      return res.status(404).json({
        error: 'Active trip not found.',
      });
    }

    return res.status(200).json({
      message: 'Trip ended successfully.',
      trip,
    });
  } catch (error) {
    return handleError(res, error);
  }
});


app.get('/api/passenger/search', async (req, res) => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({
        error: 'Please provide both source and destination locations.'
      });
    }

    // Find all ACTIVE trips matching the route
    // Using case-insensitive regex for better user experience
    const trips = await Trip.find({
      status: 'ACTIVE',
      source: { $regex: new RegExp(source, 'i') },
      destination: { $regex: new RegExp(destination, 'i') }
    }).select('busId currentLocation startTime speed source destination');

    if (trips.length === 0) {
      return res.status(404).json({
        message: 'No active buses found for this route at the moment.',
        trips: []
      });
    }

    return res.status(200).json({
      count: trips.length,
      trips
    });
  } catch (error) {
    console.error('Search Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

async function startServer() {
  try {
    await mongoose.connect("mongodb+srv://mohitchauhan6585:mohitchauhan658@cluster0.dzlhrgq.mongodb.net/whereismybus");
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();

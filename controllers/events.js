const { response } = require("express");
const Event = require("../models/Events");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  res.status(201).json({
    status: "success",
    events,
  });
};

const createEvents = async (req, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;
    const eventDB = await event.save();

    res.status(201).json({
      status: "sueccess",
      event: eventDB,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: "Internal Server Error",
    });
  }
};

const updateEvents = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        status: "success",
        msg: "Event not exist with this Id",
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        status: "Error",
        msg: "Do not have privileges to update this event",
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.status(201).json({
      status: "Success",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: "Internal Server Error",
    });
  }
};

const deleteEvents = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        status: "success",
        msg: "Event not exist with this Id",
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        status: "Error",
        msg: "Do not have privileges to delete this event",
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({ status: "Success", msg: "Deleted" });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
};

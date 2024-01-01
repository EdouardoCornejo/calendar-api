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

const updateEvents = (req, res = response) => {
  const { uid, events } = req;

  res.status(201).json({
    uid,
    events,
  });
};

const deleteEvents = (req, res = response) => {
  const { uid, events } = req;

  res.status(201).json({
    uid,
    events,
  });
};

module.exports = {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
};

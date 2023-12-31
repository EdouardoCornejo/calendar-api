const { response } = require("express");

const getEvents = async (req, res = response) => {
  res.status(201).json({
    status: "success",
    msg: "getEventos",
  });
};

const createEvents = async (req, res = response) => {
  // const { uid, events } = req;

  res.status(201).json({
    status: "sueccess",
  });
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

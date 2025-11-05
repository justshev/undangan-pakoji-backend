import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.get("/api/guests", async (req, res) => {
  const guests = await prisma.guest.findMany();
  console.log(guests);
  return res.json(guests);
});

// Update guest (e.g., name)
app.patch("/api/guests/:id", async (req, res) => {
  const { id } = req.params;
  const { name, totalInvited, confirmedGuests, isArrived } = req.body || {};

  try {
    const updated = await prisma.guest.update({
      where: { id },
      data: {
        ...(typeof name === "string" ? { name } : {}),
        ...(typeof totalInvited !== "undefined"
          ? { totalInvited: String(totalInvited) }
          : {}),
        ...(typeof confirmedGuests !== "undefined"
          ? { confirmedGuests: Number(confirmedGuests) }
          : {}),
        ...(typeof isArrived !== "undefined" ? { isArrived: Boolean(isArrived) } : {}),
      },
    });
    return res.status(200).json({ success: true, guest: updated });
  } catch (err) {
    return res.status(400).json({ error: "Failed to update guest" });
  }
});

// Delete guest
app.delete("/api/guests/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.guest.delete({ where: { id } });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: "Failed to delete guest" });
  }
});

app.post("/api/guests/confirm/:id", async (req, res) => {
  const { confirmedGuests } = req.body;
  const { id } = req.params;
  const token = uuidv4();

  console.log("id: ", id);
  try {
    const guest = await prisma.guest.update({
      where: { id },
      data: {
        confirmedGuests: Number(confirmedGuests),
        qrCodeToken: token,
      },
    });
    return res.json({ qrCodeToken: token, guest });
  } catch (err) {
    return res.status(400).json({ error: "Guest not found" });
  }
});

app.get("/api/guests/:guestId", async (req, res) => {
  const { guestId } = req.params;

  try {
    const guest = await prisma.guest.findUnique({
      where: {
        id: guestId,
      },
      select: {
        name: true,
      },
    });
    return res.status(200).json(guest);
  } catch (err) {
    return res.status(400).json({ error: "Guest not found" });
  }
});

app.get("/api/guests/validate/:token", async (req, res) => {
  try {
    console.log(req.params);
    const guest = await prisma.guest.update({
      where: { qrCodeToken: req.params.token },
      data: {
        isArrived: true,
        arrivalTime: new Date(),
      },
    });
    return res.json({ success: true, guest });
  } catch (err) {
    return res.status(404).json({ error: "Invalid QR" });
  }
});

app.post("/api/comment", async (req, res) => {
  try {
    const { name, message } = req.body;

    const comment = await prisma.comment.create({
      data: {
        name,
        message,
      },
    });

    return res.status(200).json({ success: true, comment });
  } catch (err) {
    return res.status(404).json({ error: "Failed add comment" });
  }
});

app.get("/api/comments", async (req, res) => {
  try {
    const comments = await prisma.comment.findMany();
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(404).json({ error: "Failed get comment data" });
  }
});

app.post("/api/guests", async (req, res) => {
  const { name, email, totalInvited } = req.body;

  try {
    const guest = await prisma.guest.create({
      data: {
        name,
        email,
        totalInvited,
      },
    });
    return res.json({ success: true, guest });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Gagal menambahkan tamu", detail: err.message });
  }
});

app.post("/api/guest/add", async (req, res) => {
  const { name, totalInvited } = req.body;

  try {
    const guest = await prisma.guest.create({
      data: {
        name,
        totalInvited: totalInvited.toString(),
      },
    });
    return res.json({ success: true, guest });
  } catch (err) {
    return res.status(400).json({ error: "Failed add guest" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));

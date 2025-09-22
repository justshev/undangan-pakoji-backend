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
  res.json(guests);
});

app.post("/api/guests/confirm/:id", async (req, res) => {
  const { confirmedGuests } = req.body;
  const token = uuidv4();

  try {
    const guest = await prisma.guest.update({
      where: { id: req.params.id },
      data: {
        confirmedGuests,
        qrCodeToken: token,
      },
    });
    res.json({ qrCodeToken: token, guest });
  } catch (err) {
    res.status(400).json({ error: "Guest not found" });
  }
});

app.get("/api/guests/validate/:token", async (req, res) => {
  try {
    const guest = await prisma.guest.update({
      where: { qrCodeToken: req.params.token },
      data: {
        isArrived: true,
        arrivalTime: new Date(),
      },
    });
    res.json({ success: true, guest });
  } catch (err) {
    res.status(404).json({ error: "Invalid QR" });
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
    res.json({ success: true, guest });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Gagal menambahkan tamu", detail: err.message });
  }
});

app.listen(3001, () => console.log("Backend running"));

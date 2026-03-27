const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// ─── Models ───────────────────────────────────────────────
const patientSchema = new mongoose.Schema({
  name: String, age: Number, email: String, phone: String,
  condition: String, urgency: { type: String, default: "medium" },
  supportNeeded: String, address: String, status: { type: String, default: "pending" },
  aiSummary: String,
}, { timestamps: true });

const volunteerSchema = new mongoose.Schema({
  name: String, email: String, phone: String,
  skills: [String], availability: { type: String, default: "flexible" },
  experience: String, location: String, motivation: String,
  status: { type: String, default: "pending" },
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  name: String, email: String, subject: String,
  message: String, autoReply: String, resolved: { type: Boolean, default: false },
}, { timestamps: true });

const Patient  = mongoose.models.Patient  || mongoose.model("Patient",  patientSchema);
const Volunteer= mongoose.models.Volunteer|| mongoose.model("Volunteer",volunteerSchema);
const Contact  = mongoose.models.Contact  || mongoose.model("Contact",  contactSchema);

// ─── DB connect (cached for serverless) ───────────────────
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// ─── AI helpers ───────────────────────────────────────────
function generateAISummary(d) {
  const map = {
    critical: "⚠️ CRITICAL — Immediate intervention required.",
    high:     "🔴 HIGH priority — Urgent attention needed within 24 hours.",
    medium:   "🟡 MEDIUM priority — Schedule within this week.",
    low:      "🟢 LOW priority — Standard queue, monitor regularly.",
  };
  return `Patient ${d.name} (Age: ${d.age}) requires support for: ${d.condition}.\nSupport needed: ${d.supportNeeded}.\nPriority assessment: ${map[d.urgency] || map.medium}\nContact: ${d.email} | ${d.phone}.`;
}

function generateAutoReply(subject, message) {
  const s = (subject + " " + message).toLowerCase();
  if (s.includes("appointment") || s.includes("schedule") || s.includes("book"))
    return "Thank you! Our team will contact you within 24 hours to schedule your appointment. For urgent needs call 1800-XXX-XXXX.";
  if (s.includes("volunteer") || s.includes("join"))
    return "Thank you for your interest in volunteering! Our coordinator will reach out within 48 hours with next steps.";
  if (s.includes("donat") || s.includes("fund"))
    return "Thank you for your generous support! Our finance team will reach out with payment options and tax exemption details within 24 hours.";
  if (s.includes("emergency") || s.includes("urgent") || s.includes("critical"))
    return "⚠️ Your message has been flagged URGENT. A team member will contact you within 2 hours. For medical emergencies call 112 immediately.";
  if (s.includes("medicine") || s.includes("medication") || s.includes("prescription"))
    return "Thank you for your inquiry. Our medical support team will review your request and respond within 24 hours.";
  return "Thank you for contacting HealthBridge NGO. We have received your message and will respond within 24–48 hours. For urgent matters call 1800-XXX-XXXX.";
}

const faqs = [
  { keywords: ["hours","open","timing","time","working"], answer: "🕐 We are open Monday–Saturday, 9 AM to 6 PM. Emergency support is available 24/7 via our helpline: 1800-XXX-XXXX." },
  { keywords: ["appointment","book","schedule","visit","meet"], answer: "📅 To book an appointment, fill out our Patient Support Form on this website or call 1800-XXX-XXXX. We'll confirm within 24 hours." },
  { keywords: ["volunteer","join","help","register"], answer: "🤝 You can register as a volunteer using the Volunteer Registration form! We need help in medical assistance, counseling, logistics, and awareness campaigns." },
  { keywords: ["free","cost","charge","fee","payment","price"], answer: "💚 All our patient support services are completely FREE of charge. We are an NGO funded by donations and grants." },
  { keywords: ["donat","fund","support financially"], answer: "❤️ Thank you for thinking of supporting us! You can donate via our website. All donations are tax-exempt under 80G." },
  { keywords: ["emergency","urgent","critical","crisis"], answer: "🚨 For medical emergencies, call 112 immediately. For urgent NGO support, call our 24/7 helpline: 1800-XXX-XXXX." },
  { keywords: ["medicine","medication","prescription","drug","tablet"], answer: "💊 We help connect patients with free/subsidized medications through government schemes and partner pharmacies. Fill the patient form to get started." },
  { keywords: ["location","address","where","office","center"], answer: "📍 Our main center is located in Raipur, Chhattisgarh. We also have mobile health camps across rural areas." },
  { keywords: ["mental","counseling","depression","anxiety","stress"], answer: "🧠 We offer free mental health counseling sessions. Our certified counselors are available Mon–Fri. Book through the Patient Support form." },
  { keywords: ["contact","reach","phone","email","call"], answer: "📞 Contact us: Phone: 1800-XXX-XXXX | Email: support@healthbridge.org | You can also use the Contact form on this site." },
  { keywords: ["hello","hi","hey","namaste"], answer: "👋 Hello! I'm HealthBot. I can help you with appointments, volunteering, donations, medications, and more. What do you need help with?" },
  { keywords: ["thank","thanks"], answer: "😊 You're welcome! Is there anything else I can help you with?" },
  { keywords: ["bye","goodbye"], answer: "👋 Goodbye! Take care and stay healthy. 💚" },
];

function findBestAnswer(msg) {
  const m = msg.toLowerCase();
  for (const faq of faqs) {
    if (faq.keywords.some(kw => m.includes(kw))) return faq.answer;
  }
  return "🤔 I'm not sure about that, but our team can help! Please use the Contact Form or call 1800-XXX-XXXX. You can also ask me about:\n• Appointments\n• Volunteering\n• Donations\n• Medications\n• Our services & timings";
}

// ─── Routes ───────────────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.post("/api/patients", async (req, res) => {
  try {
    await connectDB();
    const aiSummary = generateAISummary(req.body);
    const patient = await Patient.create({ ...req.body, aiSummary });
    res.status(201).json({ success: true, data: patient, aiSummary });
  } catch (e) {
    const aiSummary = generateAISummary(req.body);
    res.status(201).json({ success: true, data: req.body, aiSummary, note: "DB unavailable" });
  }
});

app.get("/api/patients", async (req, res) => {
  try {
    await connectDB();
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({ success: true, data: patients });
  } catch { res.json({ success: true, data: [] }); }
});

app.post("/api/volunteers", async (req, res) => {
  try {
    await connectDB();
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({ success: true, data: volunteer });
  } catch (e) {
    res.status(201).json({ success: true, data: req.body, note: "DB unavailable" });
  }
});

app.post("/api/contacts", async (req, res) => {
  try {
    await connectDB();
    const autoReply = generateAutoReply(req.body.subject, req.body.message);
    const contact = await Contact.create({ ...req.body, autoReply });
    res.status(201).json({ success: true, data: contact, autoReply });
  } catch (e) {
    const autoReply = generateAutoReply(req.body.subject || "", req.body.message || "");
    res.status(201).json({ success: true, data: req.body, autoReply, note: "DB unavailable" });
  }
});

app.post("/api/chatbot", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });
  setTimeout(() => {
    res.json({ success: true, botReply: findBestAnswer(message), timestamp: new Date() });
  }, 300);
});

module.exports = app;

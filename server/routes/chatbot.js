const express = require("express");
const router = express.Router();

const faqs = [
  {
    keywords: ["hours", "open", "timing", "time", "working"],
    answer: "🕐 We are open Monday–Saturday, 9 AM to 6 PM. Emergency support is available 24/7 via our helpline: 1800-XXX-XXXX.",
  },
  {
    keywords: ["appointment", "book", "schedule", "visit", "meet"],
    answer: "📅 To book an appointment, fill out our Patient Support Form on this website or call 1800-XXX-XXXX. We'll confirm within 24 hours.",
  },
  {
    keywords: ["volunteer", "join", "help", "register volunteer"],
    answer: "🤝 You can register as a volunteer using the Volunteer Registration form! We need help in medical assistance, counseling, logistics, and awareness campaigns.",
  },
  {
    keywords: ["free", "cost", "charge", "fee", "payment", "price"],
    answer: "💚 All our patient support services are completely FREE of charge. We are an NGO funded by donations and grants.",
  },
  {
    keywords: ["donate", "donation", "fund", "support financially"],
    answer: "❤️ Thank you for thinking of supporting us! You can donate via our website. All donations are tax-exempt under 80G.",
  },
  {
    keywords: ["emergency", "urgent", "critical", "crisis"],
    answer: "🚨 For medical emergencies, call 112 immediately. For urgent NGO support, call our 24/7 helpline: 1800-XXX-XXXX.",
  },
  {
    keywords: ["medicine", "medication", "prescription", "drug", "tablet"],
    answer: "💊 We help connect patients with free/subsidized medications through government schemes and partner pharmacies. Fill the patient form to get started.",
  },
  {
    keywords: ["location", "address", "where", "office", "center"],
    answer: "📍 Our main center is located in Raipur, Chhattisgarh. We also have mobile health camps across rural areas. Contact us for the nearest center.",
  },
  {
    keywords: ["mental", "psychological", "counseling", "depression", "anxiety", "stress"],
    answer: "🧠 We offer free mental health counseling sessions. Our certified counselors are available Mon–Fri. Book through the Patient Support form.",
  },
  {
    keywords: ["contact", "reach", "phone", "email", "call"],
    answer: "📞 Contact us: Phone: 1800-XXX-XXXX | Email: support@healthbridge.org | You can also use the Contact form on this site.",
  },
  {
    keywords: ["hello", "hi", "hey", "namaste", "greet"],
    answer: "👋 Hello! I'm HealthBot, your assistant for HealthBridge NGO. I can help you with appointments, volunteering, donations, medications, and more. What do you need help with?",
  },
  {
    keywords: ["thank", "thanks", "thankyou"],
    answer: "😊 You're welcome! Is there anything else I can help you with? Remember, we're here to support you.",
  },
  {
    keywords: ["bye", "goodbye", "exit", "quit"],
    answer: "👋 Goodbye! Take care and stay healthy. Don't hesitate to come back if you need help. 💚",
  },
];

function findBestAnswer(userMessage) {
  const msg = userMessage.toLowerCase();

  for (const faq of faqs) {
    if (faq.keywords.some((kw) => msg.includes(kw))) {
      return faq.answer;
    }
  }

  return "🤔 I'm not sure about that, but our team can help! Please use the Contact Form or call 1800-XXX-XXXX. You can also ask me about:\n• Appointments\n• Volunteering\n• Donations\n• Medications\n• Our services & timings";
}

router.post("/", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const answer = findBestAnswer(message);
  
  // Simulate a small delay for realism
  setTimeout(() => {
    res.json({
      success: true,
      userMessage: message,
      botReply: answer,
      timestamp: new Date(),
    });
  }, 300);
});

module.exports = router;

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "@/components/Navbar.vue";

// Animated counter values
const events = ref(0);
const organizers = ref(0);
const attendees = ref(0);

// Counter animation function
function animateValue(refVar, target, duration = 2000) {
  let start = 0;
  const stepTime = Math.abs(Math.floor(duration / target));

  const timer = setInterval(() => {
    start++;
    refVar.value = start;

    if (start >= target) clearInterval(timer);
  }, stepTime);
}

onMounted(() => {
  animateValue(events, 100);
  animateValue(organizers, 50);
  animateValue(attendees, 10000);
});
</script>

<template>
  <Navbar />

  <div class="about-wrapper">
    <!-- Hero Section -->
    <section class="hero">
      <h1>About <span class="highlight">EthioEvents</span></h1>
      <p class="subtitle">
        Your trusted partner for discovering, creating, and managing events across Ethiopia.
      </p>
    </section>

    <!-- Animated Counters -->
    <section class="counters">
      <div class="counter-box">
        <h2>{{ events }}+</h2>
        <p>Events Created</p>
      </div>

      <div class="counter-box">
        <h2>{{ organizers }}+</h2>
        <p>Organizers Joined</p>
      </div>

      <div class="counter-box">
        <h2>{{ attendees }}+</h2>
        <p>Attendees Served</p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section">
      <h2 class="section-title">Our Mission</h2>
      <p class="section-text">
        EthioEvents aims to connect communities through meaningful events.
        We empower organizers with simple yet powerful tools so they can focus
        on creating extraordinary experiences.
      </p>
    </section>

    <!-- What We Offer -->
    <section class="section">
      <h2 class="section-title">What We Offer</h2>

      <div class="card-grid">
        <div class="card">
          <h3>✔ Easy Event Management</h3>
          <p>Create, update, and manage events effortlessly with our user-friendly dashboard.</p>
        </div>

        <div class="card">
          <h3>✔ Smart Ticketing</h3>
          <p>Fast, secure digital ticketing for attendees and organizers.</p>
        </div>

        <div class="card">
          <h3>✔ Event Discovery</h3>
          <p>Find the best events based on category, location, and popularity.</p>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="section">
      <h2 class="section-title">Our Vision</h2>
      <p class="section-text">
        We believe events inspire creativity and bring people together.
        Our vision is to become Ethiopia’s most trusted and innovative event platform,
        giving every event the visibility it deserves.
      </p>
    </section>
  </div>
</template>

<style scoped>
.about-wrapper {
  max-width: 1100px;
  margin: auto;
  padding: 50px 20px;
  font-family: "Segoe UI", sans-serif;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 40px 20px;
}
.hero h1 {
  font-size: 40px;
  font-weight: 700;
}
.highlight {
  color: #1a73e8;
}
.subtitle {
  font-size: 18px;
  margin-top: 10px;
  color: #555;
}

/* Counters Section */
.counters {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  gap: 50px;
  flex-wrap: wrap;
}
.counter-box {
  text-align: center;
}
.counter-box h2 {
  font-size: 42px;
  font-weight: bold;
  color: #1a73e8;
}
.counter-box p {
  font-size: 18px;
  margin-top: 5px;
  color: #333;
}

/* Sections */
.section {
  margin-top: 60px;
}
.section-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
}
.section-text {
  font-size: 17px;
  line-height: 1.7;
  color: #444;
}

/* Cards */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
  margin-top: 20px;
}
.card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: 0.3s;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}
</style>

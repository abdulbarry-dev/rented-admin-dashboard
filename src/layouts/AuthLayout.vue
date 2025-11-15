<!-- LAYOUT FILE PURPOSE: Minimal authentication layout for login and password pages -->
<!--
LAYOUT STRUCTURE:
- Centered form container
- No sidebar or navigation
- Optional branding/logo
- Clean, focused design for authentication flows

LAYOUT RESPONSIBILITIES:
- Display login, register, forgot password, reset password pages
- Center content vertically and horizontally
- Show branding and welcome messages
- Responsive design for all devices
- Optional background image or gradient
-->

<template>
  <div class="auth-layout">
    <!-- BACKGROUND DECORATION (Optional) -->
    <!--
    IMPLEMENTATION NOTES:
    - Display background image or gradient
    - Add decorative elements for visual appeal
    - Ensure text readability with overlays
    - Use subtle animations for modern feel
    -->
    <div class="auth-background">
      <!-- Background pattern or image -->
    </div>

    <!-- CENTERED AUTH CONTAINER -->
    <!--
    IMPLEMENTATION NOTES:
    - Center container vertically and horizontally
    - Max width for readability (500-600px)
    - White/light background card
    - Box shadow for depth
    - Rounded corners for modern look
    - Padding for spacing
    -->
    <div class="auth-container">
      <!-- BRANDING SECTION -->
      <!--
      IMPLEMENTATION NOTES:
      - Display app logo and name
      - Show tagline or description
      - Link logo to home page (if user is authenticated)
      - Center aligned
      -->
      <div class="auth-branding">
        <div class="auth-logo">
          <!-- Logo image or icon -->
          <img src="/logo.svg" alt="Rented Logo" />
        </div>
        <h1 class="auth-title">Rented Admin</h1>
        <p class="auth-subtitle">Secure Admin Portal</p>
      </div>

      <!-- AUTH CONTENT (Router View) -->
      <!--
      IMPLEMENTATION NOTES:
      - Render current auth page (login, register, etc.)
      - Support page transitions
      - Handle loading states
      - Display error messages
      - Show success messages
      -->
      <div class="auth-content">
        <transition name="auth-fade" mode="out-in">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </transition>
      </div>

      <!-- FOOTER LINKS -->
      <!--
      IMPLEMENTATION NOTES:
      - Show links to privacy policy, terms
      - Display copyright information
      - Support/help links
      - Language selector (if multi-language)
      - Small, unobtrusive text
      -->
      <div class="auth-footer">
        <p class="copyright">&copy; {{ currentYear }} Rented. All rights reserved.</p>
        <div class="footer-links">
          <a href="/privacy" target="_blank">Privacy Policy</a>
          <span class="separator">•</span>
          <a href="/terms" target="_blank">Terms of Service</a>
          <span class="separator">•</span>
          <a href="/support" target="_blank">Support</a>
        </div>
      </div>
    </div>

    <!-- ALERT/NOTIFICATION DISPLAY -->
    <!--
    IMPLEMENTATION NOTES:
    - Show global notifications (e.g., "Check your email")
    - Display error alerts
    - Position at top center or bottom center
    - Auto-dismiss after timeout
    - Allow manual dismissal
    -->
    <div v-if="globalAlert" class="global-alert" :class="globalAlert.type">
      <div class="alert-content">
        <span class="alert-icon">
          <!-- Icon based on alert type (success, error, info) -->
        </span>
        <p class="alert-message">{{ globalAlert.message }}</p>
        <button class="alert-close" @click="dismissAlert">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SCRIPT PURPOSE: Auth layout state and helpers
//
// IMPLEMENTATION NOTES:

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// REACTIVE STATE:

// Global alert for notifications
// - Show success/error messages
// - Auto-dismiss after timeout
const globalAlert = ref<{ type: string; message: string } | null>(null)

// Current route
const route = useRoute()

// COMPUTED PROPERTIES:

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear())

// METHODS:

// Dismiss global alert
function dismissAlert() {
  globalAlert.value = null
}

// Show alert message
function showAlert(type: string, message: string, duration = 5000) {
  // IMPLEMENTATION:
  // 1. Set alert data
  // 2. Auto-dismiss after duration
  // 3. Clear any existing timeout

  globalAlert.value = { type, message }

  if (duration > 0) {
    setTimeout(() => {
      dismissAlert()
    }, duration)
  }
}

// LIFECYCLE HOOKS:

onMounted(() => {
  // INITIALIZATION:
  // 1. Check for alert in route query params
  // 2. Display if present (e.g., "Account created successfully")
  // 3. Clear from URL after displaying

  if (route.query.message) {
    const messageType = route.query.type as string || 'info'
    showAlert(messageType, route.query.message as string)
  }

  // Set page title
  document.title = `${route.meta.title || 'Login'} - Rented Admin`
})

// PROVIDE FOR CHILD COMPONENTS:
// - Allow auth pages to trigger alerts
// - Example: showAlert('success', 'Password reset email sent')
// defineExpose({ showAlert })
</script>

<style scoped>
/* AUTH LAYOUT STYLES */
/*
IMPLEMENTATION NOTES:
- Full viewport height layout
- Flexbox for centering
- Gradient or image background
- Responsive design for mobile
- Clean, modern aesthetic
- Focus on form readability
*/

.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Or use background image:
  background-image: url('/auth-bg.jpg');
  background-size: cover;
  background-position: center;
  */
  padding: 2rem;
}

/* BACKGROUND DECORATION */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  /* Add decorative patterns or shapes */
  /* Can use SVG patterns, geometric shapes, etc. */
}

/* AUTH CONTAINER */
.auth-container {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 3rem 2.5rem;
  position: relative;
  z-index: 1;
}

/* BRANDING */
.auth-branding {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-logo {
  margin-bottom: 1rem;
}

.auth-logo img {
  height: 60px;
  width: auto;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0.5rem 0;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

/* AUTH CONTENT */
.auth-content {
  margin-bottom: 2rem;
}

/* PAGE TRANSITIONS */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.auth-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.auth-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* FOOTER */
.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.copyright {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-links .separator {
  color: var(--text-muted);
}

/* GLOBAL ALERT */
.global-alert {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 300px;
  max-width: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.alert-content {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem;
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-message {
  flex: 1;
  margin: 0;
  font-size: 0.95rem;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.alert-close:hover {
  color: var(--text-primary);
}

/* Alert type styles */
.global-alert.success {
  border-left: 4px solid #10b981;
}

.global-alert.success .alert-icon::before {
  content: '✓';
  color: #10b981;
}

.global-alert.error {
  border-left: 4px solid #ef4444;
}

.global-alert.error .alert-icon::before {
  content: '✕';
  color: #ef4444;
}

.global-alert.info {
  border-left: 4px solid #3b82f6;
}

.global-alert.info .alert-icon::before {
  content: 'ℹ';
  color: #3b82f6;
}

/* RESPONSIVE STYLES */
@media (max-width: 576px) {
  .auth-layout {
    padding: 1rem;
  }

  .auth-container {
    padding: 2rem 1.5rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }

  .global-alert {
    left: 1rem;
    right: 1rem;
    transform: none;
    min-width: auto;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

/* ACCESSIBILITY */
@media (prefers-reduced-motion: reduce) {
  .auth-fade-enter-active,
  .auth-fade-leave-active,
  .global-alert {
    animation: none;
    transition: none;
  }
}
</style>

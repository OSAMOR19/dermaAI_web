# WBH Skin | Website Review Report
**Confidential**

**wbhskin.com | Wholesale Beauty Hub**

*Functionality • Security • Responsiveness • AI Feature Analysis*

**Prepared by:** Temitope (Enthroned) — Business Analyst | AI & Technology Specialist
**Date:** May 9, 2025 | **Version:** 1.0

---

## 1. Executive Summary

This report presents a comprehensive review of the Wholesale Beauty Hub website (wbhskin.com), a UK-based beauty e-commerce platform that incorporates an AI-powered skin analysis feature. The review covers key quality dimensions including functionality, security, user interface design, responsiveness, AI feature accuracy, and overall user experience.

The platform demonstrates a promising value proposition — combining premium beauty product retail with personalised AI skin diagnostics. However, testing revealed several critical functional defects that significantly undermine the reliability and credibility of the platform, particularly around its core AI features and user interaction forms.

| Review Dimension | Score | Summary Observation |
|---|---|---|
| Overall Functionality | **5 / 10** | Core features partially working; critical defects in AI and forms |
| AI Skin Analysis (Live) | **6 / 10** | Camera captures face but detection speed is slow; no progress feedback shown |
| AI Skin Analysis (Upload) | **4 / 10** | Accepts multi-face image but fails face detection; still returns report |
| Consultation Form | **0 / 10** | Form is entirely non-functional; no submission response or validation |
| Single-Image AI Report | **7 / 10** | Report output appears reasonable for a proper single-face image |
| UI / Design | **7 / 10** | Clean, professional aesthetic; well-branded |
| Responsiveness | **6 / 10** | Generally mobile-accessible; minor layout issues noted |
| Security Indicators | **5 / 10** | HTTPS present; no visible privacy policy or GDPR compliance notice |

---

## 2. Site Overview

| Field | Details |
|---|---|
| **Website URL** | https://www.wbhskin.com |
| **Business Type** | B2C / B2B Beauty E-Commerce with AI Skin Diagnostics |
| **Target Market** | UK consumers, beauty enthusiasts, salon owners, influencers |
| **Key Features** | AI skin scan (live & upload), product recommendations, wholesale, consultation form |
| **Review Date** | May 9, 2025 |

---

## 3. Functionality Review

### 3.1 AI Skin Analysis — Live Face Scanner

> ⚠️ **PERFORMANCE ISSUE: Live scanner face detection is slow**

The live face scanning feature successfully activates the camera and captures the user's face. However, the face detection and processing step is noticeably slow, creating a poor user experience. There is a significant lag between camera activation and the point at which the system acknowledges the face and begins analysis. This delay, without adequate feedback or a progress indicator, leaves users uncertain about whether the feature is working or has stalled.

For a platform that positions AI skin scanning as its core differentiator, detection speed is critical to the first impression. Users who experience prolonged delays without feedback may abandon the feature or assume it has failed, undermining trust even when the feature ultimately works.

**Issues identified:**
- Camera activates and face capture is functional
- No visual feedback or error message communicated to the user
- No fallback path offered (e.g., redirect to image upload)
- Face detection algorithm appears computationally heavy; may benefit from optimisation or server-side offloading
- No loading indicator or progress feedback shown during the detection wait period

**Visual Evidence — Screenshot Analysis**

The following screenshots were captured during live testing and demonstrate the scanner's failure to validate whether an actual face is present before generating a report. In multiple instances, the system accepted a frame containing a wall, a partial face, or two faces, and still proceeded to produce analysis results — in some cases with high confidence scores.

- *Figure 1 — Scanner captures a split view (wall + partial face). System flags poor image quality yet returns "Your skin looks healthy!" (8:41 PM)*
- *Figure 2 — Two faces in frame (adult + child). System generates 5 conditions (e.g. Hyperpigmentation 85%) with no indication of which face was analysed (8:17 PM)*
- *Figure 3 — Same poor split-view scan, yet this time system returns 4 conditions with moderate confidence scores — inconsistent with Figure 1 result (8:41 PM)*
- *Figure 4 — Scan captures wall only, no face present. System still returns "Your skin looks healthy!" — clearest evidence of false-positive detection (8:52 PM)*

---

### 3.2 AI Skin Analysis — Image Upload

> ⚠️ **HIGH DEFECT: Multi-face image accepted without detection or disambiguation**

When an image containing two faces was uploaded for AI skin analysis, the system failed to detect multiple faces or raise any validation error. Despite this, the platform proceeded to generate a skin analysis report. This raises a fundamental data integrity question: **which face was analysed?** The report contains no attribution, no clarification, and no indication of which subject the results apply to.

For a medical-adjacent application providing personalised health-related skin assessments, this is a serious reliability and trust issue. Users could act on analysis results that do not pertain to them.

**Issues identified:**
- No multi-face detection or validation logic at the input stage
- System generates a report without confirming which face was selected
- No error, warning, or prompt asking the user to upload a clearer, single-face image
- Report lacks any subject disambiguation metadata
- Risk of users receiving and acting on irrelevant or incorrect skin data

---

### 3.3 AI Skin Analysis — Single-Face Image Upload

> ✅ **FUNCTIONAL: Report output is reasonable for a clean single-face image**

When a clear, properly framed image containing a single face was uploaded, the AI analysis feature performed acceptably. The generated report appeared coherent and contained relevant skin condition observations and product recommendations aligned with the image provided. This confirms that the underlying AI model has valid capability when inputs are controlled.

**Positive observations:**
- Report generated successfully and in a reasonable timeframe
- Skin observations appeared contextually appropriate to the image
- Product recommendations were related to the identified skin concerns
- Report layout was readable and structured

---

### 3.4 Consultation Form

> 🔴 **CRITICAL DEFECT: Consultation form is entirely non-functional**

The consultation form on the platform did not function during testing. Form submission produced no response — no success confirmation, no error message, no validation feedback, and no indication that the submission was received or processing.

For a beauty platform offering professional consultation as part of its service proposition, a broken contact/consultation form directly damages its ability to acquire leads and maintain client relationships.

**Issues identified:**
- Form submission produces no visible response or feedback
- No client-side or server-side validation messages displayed
- Unknown whether form data is being transmitted to backend at all
- No confirmation email or acknowledgment mechanism
- Potentially broken form action endpoint or JavaScript handler

---

### 3.5 Navigation & General Usability

General site navigation and layout appear functional. The product catalogue, page routing, and primary calls-to-action load as expected. No broken links or 404 errors were observed during standard navigation. The interface is generally intuitive and aligned with modern e-commerce conventions.

- Menu navigation is functional
- Product pages load correctly
- Call-to-action buttons are visible and responsive
- No broken internal links observed during review

---

## 4. Security Review

Security was assessed based on observable indicators without penetration testing tools.

| Security Indicator | Status | Observation |
|---|---|---|
| HTTPS / SSL Certificate | ✅ **PASS** | Site uses HTTPS; SSL certificate is active |
| Privacy Policy / GDPR Notice | ⚠️ **CONCERN** | No visible cookie consent banner or clear GDPR policy for UK-based users |
| Biometric / Camera Data Disclosure | ❌ **FAIL** | No user disclosure about how facial/biometric scan data is used, stored, or processed |
| Login / Account Security | ⚠️ **LIMITED** | Standard login available; no visible 2FA or account security options |
| Dashboard Access Control (/dashboard) | ✅ **PASS** | Dashboard correctly restricts unauthenticated direct access (returns 403) |

> **Key security concern:** Given that the live scanner captures facial biometric data and the upload feature processes personal images, the absence of clear disclosure about how this data is handled, retained, or shared presents a **significant legal risk under UK GDPR** and potentially the ICO's guidance on biometric data. This must be addressed as a priority.

---

## 5. Responsiveness & Cross-Platform Review

### 5.1 Desktop
- Layout renders cleanly at standard desktop resolutions (1280px and above)
- Navigation, product grids, and AI tool sections are well-proportioned
- Banner and hero section display as intended

### 5.2 Mobile / Tablet
- The site appears to use responsive CSS (likely via a CSS framework)
- Core navigation collapses into a mobile-friendly format
- AI scanner UI may not be optimised for mobile camera permissions and rendering
- Form fields and buttons appear tappable on touch devices
- Some complex layout sections may require horizontal scrolling on smaller screens

> **Recommendation:** Conduct dedicated device testing on iOS Safari and Android Chrome, particularly for the camera scanner feature, which relies on browser-level camera API access that behaves differently across platforms.

---

## 6. AI Feature Integrity & Trust Concerns

The platform's core competitive differentiator is its AI-powered skin analysis. For this feature to command user trust, it must demonstrate accuracy, transparency, and integrity. The following concerns were identified:

### 6.1 Ambiguous Report Attribution
When a multi-face image was uploaded and a report was still generated, the system failed to specify which subject was analysed. This creates a fundamental trust and accuracy problem. Users should never receive skin health recommendations without certainty that the analysis applies to them.

### 6.2 Absence of Confidence Scoring
The AI-generated report does not appear to include a confidence score or quality indicator to communicate to the user how reliable the analysis is, based on image clarity, lighting, or angle. This is standard practice in AI health-adjacent tools.

### 6.3 No Image Quality Validation
The system accepts images without performing pre-analysis quality checks (e.g., blur detection, lighting adequacy, face count verification). A robust AI feature should validate input quality before generating and presenting results.

### 6.4 No Disclaimer / Medical Caveat
Skin analysis tools that surface health-related insights are expected to include a disclaimer clarifying that the results are for informational purposes only and do not constitute medical advice. No such disclaimer was prominently visible in the generated report.

---

## 7. User Experience & Design

Despite the functional defects noted above, the platform demonstrates a strong visual identity and clear design intent.

### 7.1 Strengths
- Professional, modern visual design consistent with a premium beauty brand
- Clear value proposition communicated on the homepage
- Product layout follows e-commerce best practices
- Testimonials and social proof are well-positioned
- Call-to-action buttons are prominent and clearly labelled

### 7.2 Areas for Improvement
- Error states and loading states are not adequately handled or communicated
- The broken live scanner leaves users with no feedback or guidance
- The broken consultation form creates a silent failure that erodes trust
- No onboarding tutorial or guidance for new users approaching the AI scan feature
- Accessibility review recommended — colour contrast and ARIA label compliance not assessed

---

## 8. Consolidated Issues & Recommendations

| Area | Issue | Severity | Recommendation |
|---|---|---|---|
| **Live Scanner** | Camera captures face but face detection is slow; no progress indicator | **Medium** | Optimise face detection model speed; add a progress spinner or status message (e.g. "Analysing your skin...") |
| **Image Upload** | Multi-face image accepted without detection; report generated without subject attribution | **High** | Implement face-count validation; reject multi-face images with clear instruction to user |
| **AI Report** | No indication of which face was analysed; no confidence score displayed | **High** | Add face selection step if multiple faces detected; include confidence/quality score in report |
| **Consultation Form** | Form submission produces no response, feedback, or confirmation | **Critical** | Fix form endpoint/handler; add client-side validation and submission confirmation messaging |
| **GDPR / Privacy** | No biometric data disclosure; no cookie consent notice visible for UK users | **High** | Add biometric data usage policy; implement GDPR-compliant cookie consent banner |
| **AI Report** | No medical disclaimer in generated skin analysis report | **Medium** | Add prominent disclaimer: results are informational only and not a substitute for medical advice |
| **Image Quality** | No pre-analysis input validation (blur, lighting, face detection) | **Medium** | Implement image quality check before processing; reject or warn on low-quality inputs |
| **Mobile (Scanner)** | Live scanner camera behaviour may differ across mobile browsers | **Medium** | Test on iOS Safari and Android Chrome; handle browser permission denied gracefully |
| **Single-Image AI** | Report output is reasonable for proper image input | **Pass** | Maintain current AI model performance; expand test coverage for edge cases |

---

## 9. Conclusion & Recommendations

wbhskin.com demonstrates clear potential as a differentiated beauty platform. The combination of AI-driven skin diagnostics with a wholesale and direct-to-consumer product offering is a compelling proposition in the UK beauty market. The visual design is professional and the underlying AI model, when fed appropriate input, produces reasonable output.

However, the platform currently has **critical functional gaps** that must be resolved before it can be considered production-ready or presented to a wider audience with confidence. The two most pressing issues are:

1. **The live face scanner is completely non-functional** — the primary AI feature of the platform does not work.
2. **The consultation form does not function** — a critical user acquisition and engagement pathway is broken.

Additionally, the multi-face image handling presents an integrity risk that could undermine user trust and expose the business to reputational harm. GDPR compliance, particularly around biometric data collection via facial scanning, should be treated as a **legal priority** for a UK-based platform.

It is recommended that the platform undergo a **structured remediation sprint** addressing the critical and high-severity issues before any marketing push or investor demonstration. Once resolved, the platform has a strong foundation to compete effectively in the AI-enhanced beauty technology space.

---

*End of Report — wbhskin.com Website Review*
*Prepared by Temitope (Enthroned) | May 2025*

const chatLauncher = document.querySelector(".chatbot-launcher");
const chatPanel = document.querySelector(".chatbot-panel");
const chatMessages = document.querySelector(".chatbot-messages");
const chatForm = document.querySelector(".chatbot-form");
const chatInput = document.querySelector(".chatbot-input");
const chatSend = document.querySelector(".chatbot-send");
const chatClose = document.querySelector(".chatbot-close");
const chatMinimize = document.querySelector(".chatbot-minimize");
const chatClear = document.querySelector(".chatbot-clear");
const chatbotAvatarSource = "chatbotpic.jpg";

const suggestedQuestions = [
  "Tell me about Iron.",
  "What are his technical skills?",
  "What projects has he developed?",
  "What was his role in Smart Campus Companion?",
  "Does he have any certifications?",
  "How can I contact him?",
  "When is Iron's birthday?",
];

const responseCategories = {
  greetingsAndCasualConversation: {
    hi: { text: "Hello! Nice to meet you. I'm Iron's Assistant. What would you like to know?" },
    hello: { text: "Hi there! How can I help you today?" },
    hey: { text: "Hey! What would you like to know about Iron?" },
    morning: { text: "Good morning! What would you like to know about Iron?" },
    afternoon: { text: "Good afternoon! What would you like to know about Iron?" },
    evening: { text: "Good evening! What would you like to know about Iron?" },
    whatsUp: { text: "Not much! I'm here to help you learn about Iron. What's on your mind?" },
    howAreYou: { text: "I'm doing well, thanks for asking! What would you like to know about Iron?" },
    thanks: { text: "You're welcome! Let me know if you'd like to know anything else about Iron." },
    goodbye: { text: "Goodbye! Thanks for visiting Iron's portfolio." },
  },
  personalInformation: {
    identity: {
      text:
        "Iron L. Biblanias is an aspiring mobile developer based in Calamba City, Laguna, Philippines.",
    },
    role: { text: "Iron's current role is Aspiring Mobile Developer." },
    age: { text: "Iron is currently 23 years old." },
    birthday: { text: "Iron's birthday is September 11, 2003." },
  },
  aboutIron: {
    text:
      "Iron L. Biblanias is an aspiring mobile developer and Information Technology student specializing in Mobile Application Development. He is interested in mobile and web development, has experience from academic projects, and aims to improve his programming skills while building useful applications.",
  },
  education: {
    text:
      "Iron is studying for a Bachelor of Science in Information Technology (BSIT), specializing in Mobile Application Development.",
  },
  technicalSkills: {
    text:
      "Programming languages: Java, Kotlin, PHP, JavaScript, HTML, and CSS.\nFrameworks and technologies: Laravel, React, and MySQL.\nTools and platforms: Git, GitHub, Figma, Canva, Railway, and Render.",
  },
  projects: {
    overview: {
      text:
        "Iron's projects include the Project Tracker System with Descriptive Analytics and 2D Mapping, a Cabuyao City development-project monitoring system built with Laravel, PHP, MySQL, JavaScript, and Leaflet; and Smart Campus Companion, a collaborative academic Android project built with Kotlin, Jetpack Compose, Firebase, Room Database, Git, and GitHub.",
    },
    tracker: {
      text:
        "The Project Tracker System with Descriptive Analytics and 2D Mapping is a web-based system for monitoring local development projects in Cabuyao City. It includes project tracking, descriptive analytics, budget reporting, and interactive 2D mapping. Technologies: Laravel, PHP, MySQL, JavaScript, and Leaflet.",
    },
    campus: {
      text:
        "Smart Campus Companion is a collaborative academic Android project with student and administrator portals, authentication, real-time announcements, and task and schedule management. Iron served as Git Manager, handling version control, code integration, pull requests, and team collaboration. Technologies: Kotlin, Jetpack Compose, Firebase, Room Database, Git, and GitHub.",
    },
  },
  certifications: {
    text:
      "Iron's listed certification is the Ignite Philippines Entrepreneurship Program from the Wadhwani Foundation, 2026.",
  },
  hobbiesAndInterests: {
    general: {
      text: "Iron enjoys playing online games and basketball during his free time.",
    },
    games: { text: "Yes! Iron enjoys playing online games." },
    sports: { text: "Yes, Iron enjoys playing basketball." },
  },
  contactInformation: {
    text: "You can contact Iron using any of these links:",
    links: [
      { label: "Email", href: "mailto:biblaniasiron4@gmail.com" },
      { label: "GitHub", href: "https://github.com/ironbibla-dev" },
      { label: "Facebook", href: "https://www.facebook.com/iron.biblanias" },
    ],
  },
  fallback: {
    text:
      "I'm not sure about that yet, but I'd be happy to answer questions about Iron's background, education, skills, projects, hobbies, or interests.",
  },
};

const greetingPhrases = [
  { phrases: ["hi", "hi there"], response: responseCategories.greetingsAndCasualConversation.hi },
  { phrases: ["hello", "hello there"], response: responseCategories.greetingsAndCasualConversation.hello },
  { phrases: ["hey", "hey there"], response: responseCategories.greetingsAndCasualConversation.hey },
  { phrases: ["good morning"], response: responseCategories.greetingsAndCasualConversation.morning },
  { phrases: ["good afternoon"], response: responseCategories.greetingsAndCasualConversation.afternoon },
  { phrases: ["good evening"], response: responseCategories.greetingsAndCasualConversation.evening },
  { phrases: ["whats up", "what is up"], response: responseCategories.greetingsAndCasualConversation.whatsUp },
  {
    phrases: ["how are you", "how are you doing", "hows it going", "how is it going"],
    response: responseCategories.greetingsAndCasualConversation.howAreYou,
  },
  { phrases: ["thanks", "thank you"], response: responseCategories.greetingsAndCasualConversation.thanks },
  { phrases: ["bye", "goodbye"], response: responseCategories.greetingsAndCasualConversation.goodbye },
];

let replyTimer = null;
let closeTimer = null;
let suggestionsElement = null;

function normalizeQuestion(question) {
  return question
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsPhrase(question, phrase) {
  const normalizedPhrase = normalizeQuestion(phrase);
  return ` ${question} `.includes(` ${normalizedPhrase} `);
}

function containsAnyPhrase(question, phrases) {
  return phrases.some((phrase) => containsPhrase(question, phrase));
}

function findGreeting(question) {
  const exactGreeting = greetingPhrases.find(({ phrases }) =>
    phrases.some((phrase) => normalizeQuestion(phrase) === question),
  );

  if (exactGreeting) return exactGreeting.response;

  const withoutLeadingGreeting = question.replace(
    /^(hi|hello|hey|good morning|good afternoon|good evening)( there)?\s+/,
    "",
  );

  if (withoutLeadingGreeting !== question && withoutLeadingGreeting) {
    const trailingGreeting = greetingPhrases.find(({ phrases }) =>
      phrases.some((phrase) => normalizeQuestion(phrase) === withoutLeadingGreeting),
    );
    if (trailingGreeting) return trailingGreeting.response;
  }

  return null;
}

function findAnswer(question) {
  const normalized = normalizeQuestion(question);
  const greeting = findGreeting(normalized);
  if (greeting) return greeting;

  const intentQuestion = normalized.replace(
    /^(hi|hello|hey|good morning|good afternoon|good evening)( there)?\s+/,
    "",
  );
  const projects = responseCategories.projects;
  const hobbies = responseCategories.hobbiesAndInterests;

  if (
    containsAnyPhrase(intentQuestion, [
      "smart campus",
      "campus companion",
      "git manager",
      "pull request",
      "jetpack compose",
    ])
  ) {
    return projects.campus;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "project tracker",
      "cabuyao",
      "leaflet",
      "2d mapping",
      "descriptive analytics",
      "budget reporting",
      "budget report",
    ])
  ) {
    return projects.tracker;
  }

  if (containsAnyPhrase(intentQuestion, ["play games", "plays games", "playing games", "online games", "video games", "gaming", "does he game"])) {
    return hobbies.games;
  }

  if (containsAnyPhrase(intentQuestion, ["play sports", "plays sports", "playing sports", "basketball", "sport", "sports"])) {
    return hobbies.sports;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "hobby",
      "hobbies",
      "interest",
      "interests",
      "free time",
      "for fun",
      "like doing",
      "likes doing",
      "enjoy doing",
      "enjoys doing",
    ])
  ) {
    return hobbies.general;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "birthday",
      "birth date",
      "date of birth",
      "when was he born",
      "when was iron born",
    ])
  ) {
    return responseCategories.personalInformation.birthday;
  }

  if (containsAnyPhrase(intentQuestion, ["how old", "age", "years old"])) {
    return responseCategories.personalInformation.age;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "education",
      "educational background",
      "degree",
      "major",
      "course",
      "study",
      "studies",
      "studying",
      "what did he study",
      "what is he studying",
      "field of study",
    ])
  ) {
    return responseCategories.education;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "contact",
      "email",
      "phone",
      "facebook",
      "reach out",
      "get in touch",
      "contact details",
      "social links",
      "github profile",
      "github link",
      "github account",
      "his github",
      "his facebook",
      "github url",
    ])
  ) {
    return responseCategories.contactInformation;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "certification",
      "certifications",
      "certified",
      "certificate",
      "certificates",
      "wadhwani",
      "ignite philippines",
    ])
  ) {
    return responseCategories.certifications;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "project",
      "projects",
      "what has he built",
      "what did he build",
      "what has he developed",
      "what did he develop",
      "developed",
      "built",
    ])
  ) {
    return projects.overview;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "skill",
      "skills",
      "technology",
      "technologies",
      "tech stack",
      "programming",
      "language",
      "languages",
      "framework",
      "frameworks",
      "tools",
      "platforms",
      "java",
      "kotlin",
      "php",
      "javascript",
      "html",
      "css",
      "laravel",
      "react",
      "mysql",
      "git",
      "github",
      "figma",
      "canva",
      "railway",
      "render",
    ])
  ) {
    return responseCategories.technicalSkills;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "current role",
      "professional role",
      "job title",
      "what does he do",
      "what does iron do",
      "what is his role",
      "what is irons role",
      "what is his job",
    ])
  ) {
    return responseCategories.personalInformation.role;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "name",
      "location",
      "where is he from",
      "where does he live",
      "where is iron based",
      "where is iron",
      "where is iron from",
      "where does iron live",
    ])
  ) {
    return responseCategories.personalInformation.identity;
  }

  if (
    containsAnyPhrase(intentQuestion, [
      "about",
      "who is",
      "background",
      "interested in",
      "what is iron like",
      "things he likes doing",
      "things he enjoys",
      "what does he like to do",
    ])
  ) {
    return responseCategories.aboutIron;
  }

  return responseCategories.fallback;
}

function scrollMessagesToLatest() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendChatbotAvatar(message) {
  const avatar = document.createElement("img");
  avatar.className = "chatbot-message-avatar";
  avatar.src = chatbotAvatarSource;
  avatar.alt = "";
  avatar.width = 26;
  avatar.height = 26;
  avatar.decoding = "async";
  message.append(avatar);
}

function appendMessage(role, text, links = []) {
  const message = document.createElement("div");
  message.className = `chatbot-message chatbot-message-${role}`;

  const bubble = document.createElement("div");
  bubble.className = "chatbot-bubble";

  const content = document.createElement("p");
  content.className = "chatbot-message-text";
  content.textContent = text;
  bubble.append(content);

  if (links.length > 0) {
    const linkList = document.createElement("div");
    linkList.className = "chatbot-response-links";

    links.forEach(({ label, href }) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;

      if (href.startsWith("https://")) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }

      linkList.append(link);
    });

    bubble.append(linkList);
  }

  if (role === "assistant") {
    appendChatbotAvatar(message);
  }
  message.append(bubble);
  chatMessages.append(message);
  scrollMessagesToLatest();
  return message;
}

function appendTypingIndicator() {
  const message = document.createElement("div");
  message.className = "chatbot-message chatbot-message-assistant chatbot-typing";
  message.setAttribute("role", "status");

  const bubble = document.createElement("div");
  bubble.className = "chatbot-bubble";

  const label = document.createElement("span");
  label.className = "chatbot-sr-only";
  label.textContent = "Iron's Assistant is typing";
  bubble.append(label);

  for (let index = 0; index < 3; index += 1) {
    const dot = document.createElement("span");
    dot.className = "chatbot-typing-dot";
    dot.setAttribute("aria-hidden", "true");
    bubble.append(dot);
  }

  const thinkingLabel = document.createElement("span");
  thinkingLabel.className = "chatbot-typing-label";
  thinkingLabel.textContent = "Thinking";
  bubble.insertBefore(thinkingLabel, bubble.children[1]);

  appendChatbotAvatar(message);
  message.append(bubble);
  chatMessages.append(message);
  scrollMessagesToLatest();
  return message;
}

function renderSuggestions() {
  suggestionsElement = document.createElement("div");
  suggestionsElement.className = "chatbot-suggestions";
  suggestionsElement.setAttribute("aria-label", "Suggested questions");

  suggestedQuestions.forEach((question) => {
    const button = document.createElement("button");
    button.className = "chatbot-suggestion";
    button.type = "button";
    button.textContent = question;
    button.addEventListener("click", () => handleVisitorMessage(question));
    suggestionsElement.append(button);
  });

  chatMessages.append(suggestionsElement);
}

function resetConversation() {
  chatMessages.replaceChildren();
  suggestionsElement = null;
  appendMessage(
    "assistant",
    "Hi! I'm Iron's Assistant. Ask me about his background, skills, projects, certification, or contact information.",
  );
  renderSuggestions();
  scrollMessagesToLatest();
}

function setInputEnabled(enabled) {
  chatInput.disabled = !enabled;
  chatSend.disabled = !enabled || chatInput.value.trim().length === 0;
}

function handleVisitorMessage(messageText) {
  const question = messageText.trim();
  if (!question || replyTimer !== null) return;

  if (suggestionsElement) {
    suggestionsElement.remove();
    suggestionsElement = null;
  }

  appendMessage("user", question);
  chatInput.value = "";
  setInputEnabled(false);

  const typingIndicator = appendTypingIndicator();
  const answer = findAnswer(question);

  replyTimer = window.setTimeout(() => {
    typingIndicator.remove();
    appendMessage("assistant", answer.text, answer.links);
    replyTimer = null;
    setInputEnabled(true);
    renderSuggestions();

    if (chatPanel.classList.contains("is-open") && !chatPanel.classList.contains("is-minimized")) {
      chatInput.focus();
    }
  }, 650);
}

function openChat() {
  if (closeTimer !== null) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }

  chatPanel.hidden = false;
  chatPanel.classList.remove("is-minimized");
  chatMinimize.setAttribute("aria-label", "Minimize chat");
  chatMinimize.title = "Minimize chat";
  chatLauncher.setAttribute("aria-expanded", "true");

  void chatPanel.offsetWidth;
  chatPanel.classList.add("is-open");
  chatInput.focus();
}

function closeChat() {
  chatPanel.classList.remove("is-open", "is-minimized");
  chatMinimize.setAttribute("aria-label", "Minimize chat");
  chatMinimize.title = "Minimize chat";
  chatLauncher.setAttribute("aria-expanded", "false");

  if (closeTimer !== null) {
    window.clearTimeout(closeTimer);
  }

  closeTimer = window.setTimeout(() => {
    chatPanel.hidden = true;
    closeTimer = null;
  }, 190);

  chatLauncher.focus();
}

chatLauncher.addEventListener("click", () => {
  if (chatPanel.hidden) {
    openChat();
  } else {
    closeChat();
  }
});

chatClose.addEventListener("click", closeChat);

chatMinimize.addEventListener("click", () => {
  const minimized = chatPanel.classList.toggle("is-minimized");
  chatMinimize.setAttribute("aria-label", minimized ? "Expand chat" : "Minimize chat");
  chatMinimize.title = minimized ? "Expand chat" : "Minimize chat";
});

chatClear.addEventListener("click", () => {
  if (replyTimer !== null) {
    window.clearTimeout(replyTimer);
    replyTimer = null;
  }

  setInputEnabled(true);
  resetConversation();
  chatInput.focus();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleVisitorMessage(chatInput.value);
});

chatInput.addEventListener("input", () => {
  setInputEnabled(true);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !chatPanel.hidden) {
    closeChat();
  }
});

resetConversation();

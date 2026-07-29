const brochureCatalog = {
  speedcloud: {
    title: "SpeedCloud Performance",
    category: "Performance benchmark brief",
    pdf: "assets/brochures/speedcloud/speedcloud.pdf"
  },
  supreme: {
    title: "SpeedCloud Supreme",
    category: "Performance benchmark report",
    pdf: "assets/brochures/supreme/supreme.pdf"
  },
  "ai-entitlements": {
    title: "AI Customer Entitlements",
    category: "Cloud and AI service entitlements",
    pdf: "assets/brochures/ai-entitlements/ai-entitlements.pdf"
  },
  xperience: {
    title: "The NxtGen Xperience",
    category: "India's sovereign cloud and AI",
    pdf: "assets/brochures/xperience/xperience.pdf"
  },
  "sas-f": {
    title: "SAS-F",
    category: "Standardized AI Solutions Framework",
    pdf: "assets/brochures/sas-f/sas-f.pdf"
  },
  "capability-catalog": {
    title: "SpeedCloud Capability Catalog",
    category: "SpeedCloud capability portfolio",
    pdf: "assets/brochures/capability-catalog/capability-catalog.pdf"
  },
  "supreme-redhat": {
    title: "SpeedCloud Supreme: Red Hat",
    category: "Private cloud modernisation for AI adoption",
    pdf: "assets/brochures/supreme-redhat/supreme-redhat.pdf"
  },
  "customer-entitlements": {
    title: "SpeedCloud Customer Entitlements",
    category: "Public cloud services, operations and responsibilities",
    pdf: "assets/brochures/customer-entitlements/customer-entitlements.pdf"
  },
  "supreme-customer-entitlements": {
    title: "SpeedCloud Supreme Customer Entitlements",
    category: "Private cloud services, governance and responsibilities",
    pdf: "assets/brochures/supreme-customer-entitlements/supreme-customer-entitlements.pdf"
  }
};

const requested = [...new Set(
  new URLSearchParams(window.location.search)
    .get("items")
    ?.split(",")
    .map((item) => item.trim())
    .filter((item) => brochureCatalog[item]) || []
)];

const list = document.getElementById("brochureList");
if (!requested.length) {
  const message = document.createElement("p");
  message.className = "empty";
  message.textContent = "This link does not contain a brochure selection. Return to the portal and request the brochures again.";
  list.appendChild(message);
} else {
  requested.forEach((id) => {
    const brochure = brochureCatalog[id];
    const card = document.createElement("article");
    card.className = "brochure";
    const eyebrow = document.createElement("span");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Selected brochure";
    const title = document.createElement("h2");
    title.textContent = brochure.title;
    const category = document.createElement("p");
    category.textContent = brochure.category;
    const link = document.createElement("a");
    link.className = "button";
    link.href = brochure.pdf;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open PDF";
    card.append(eyebrow, title, category, link);
    list.appendChild(card);
  });
}

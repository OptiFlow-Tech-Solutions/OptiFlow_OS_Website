## 1. Self-Service Toolbar

- [x] 1.1 Add toolbar CSS styles (grid layout, card styles, dark mode) to faq.html `<style>` block
- [x] 1.2 Add toolbar HTML markup with 4 cards (Video Tutorials, SOP Library, Guided Setup, Troubleshooting) between hero and FAQ categories
- [x] 1.3 Link each card to appropriate destinations or anchor links

## 2. FAQ Feedback Buttons

- [x] 2.1 Add feedback button CSS styles (yes/no buttons, thank-you message, follow-up prompt) to faq.html `<style>` block
- [x] 2.2 Write JS to inject feedback buttons into each `.faq-answer` div after answer text
- [x] 2.3 Implement localStorage persistence: store votes, restore state on page load
- [x] 2.4 Implement follow-up prompt for "No" votes with contact/demo link

## 3. Related Questions

- [x] 3.1 Add related-links CSS styles to faq.html `<style>` block
- [x] 3.2 Build JS `relatedMap` object mapping question indices to related question indices
- [x] 3.3 Write JS to inject related question links into each answer body
- [x] 3.4 Implement click handler: scroll to and expand the targeted FAQ item

## 4. Troubleshooting Widget

- [x] 4.1 Add troubleshooting widget CSS styles (select styling, resolution panel, dark mode) to faq.html `<style>` block
- [x] 4.2 Add troubleshooting widget HTML (3 cascading selects + resolution panel) after the last FAQ category section
- [x] 4.3 Build decision tree data structure: Category → Problem → Resolution mappings
- [x] 4.4 Implement cascade logic: category change resets problem, problem change updates resolution options
- [x] 4.5 Implement resolution panel display with description text and CTA link

## 5. Escalation Section

- [x] 5.1 Add escalation section CSS styles to faq.html `<style>` block
- [x] 5.2 Add "Still need help?" section HTML with 4 contact cards (Demo, Contact, WhatsApp, Email) before the bottom CTA

## 6. Enhanced Search

- [x] 6.1 Modify search JS to display match count ("X matches found")
- [x] 6.2 Implement term highlighting using `<mark>` elements when a user clicks a search result

## 7. Build & Validate

- [x] 7.1 Update `site.json` FAQ page description to reflect self-service capabilities
- [x] 7.2 Run `npm run build` and fix any build errors
- [x] 7.3 Run `npm run validate` and fix any validation errors

🚀 MEGA PROMPT: Araya Agri-Wellness Platform (Final Master Blueprint)
Project Name: Araya Agri-Wellness Platform
Concept: "Agri-Tech = Asset" (Transforming Farmer Data into National Assets)
Core Mission: To build Thailand's most comprehensive agriculture database that supports "Wellness" standards (Green, Germless, Geriatric, Gourmet) and connects farmers to high-value markets.
🛠️ 1. Technology Stack & Framework
Frontend: React (Vite) + TypeScript
Styling: Tailwind CSS (Mobile-first, Responsive)
UI Library: shadcn/ui (Radix UI based) + Framer Motion (for smooth animations)
Icons: Lucide React (Must use size={24} or larger for accessibility)
Charts: Recharts (Responsive containers)
Maps: Leaflet (react-leaflet) or Simple Interactive SVG Map of Thailand
Utilities: react-qr-code (Traceability), react-dropzone (Image Uploads)
🎨 2. Design System & UX Rules (Geriatric-Friendly)
Theme: "Siam Araya Premium" (Accessible, Trustworthy, Wealthy)
Color Palette:
Primary (Agriculture): Deep Emerald Green (#065F46)
Secondary (Wealth/Asset): Royal Gold (#D97706)
Action/Alert: Bright Orange (#F97316) - Used for CTAs.
Risk Indicators: Green (Low), Orange (Moderate), Red (High).
Background: Eye-comfort Light Gray (#F8FAFC).
Typography:
Font Family: Prompt or Sarabun (Google Fonts).
Rule: Titles must be Bold and Large. Body text must be readable (min 16px).
UX Rules for Elderly Farmers (Strict):
No Small Radio Buttons: Replace standard radios/checkboxes with "Big Selectable Cards" (Large Icon + Text Label + Colored Border when selected).
Thai Language Only: ALL Interface text must be in Thai. (English variables allowed in code).
Visual Hints: Use icons heavily to represent choices (e.g., a Truck icon for Logistics).
Voice Hint: Display a text hint under long text inputs: "💡 เคล็ดลับ: กดรูปไมค์ 🎙️ ที่แป้นพิมพ์เพื่อพูดแทนการพิมพ์ได้"
📱 3. Application Structure & Features
A. Landing Page (Public Face)
Hero Section: High-quality background image of a Thai farm.
Headline: "เกษตรอารยะ: เปลี่ยนพืชผลเป็นทรัพย์สิน พัฒนาชาติยั่งยืน"
Sub-headline: "ระบบฐานข้อมูลอัจฉริยะเพื่อความมั่นคงทางอาหารและสุขสภาพ"
Action Buttons:
Primary (Big/Pulse): "ลงทะเบียนเกษตรกร (เริ่มเลย)" -> Link to /register
Secondary (Outline): "สำหรับผู้บริหาร/คู่ค้า" -> Link to /admin
Key Value Props (Cards):
LLL Model: "อายุยืน 123+ ปี ด้วยอาหารเป็นยา"
4G&G Standard: "มาตรฐานเขียว ปลอดเชื้อ เพื่อผู้สูงวัย และเลิศรส"
Business Matching: "ตลาดรับซื้อที่แน่นอนและเป็นธรรม"
B. Farmer Registration Wizard (The Core Asset Collector)
Component: <Stepper> with 6 Steps. Auto-save enabled.
UI Style: Center container, max-width 600px (Mobile focus).
Step 1: ตัวตนและภาพลักษณ์ (Identity & Visual Proof)
Input: "ชื่อ-นามสกุล", "เบอร์โทรศัพท์", "เลขทะเบียนเกษตรกร".
Feature: Photo Upload:
Label: "ถ่ายรูปตัวท่านคู่กับแปลงเกษตร (ยืนยันตัวตน)"
UI: Large rectangular dropzone area with a Camera Icon.
Social Input: "ชื่อผู้แนะนำ / เครือข่าย (ถ้ามี)" (Crucial for Trust Score).
Step 2: พิกัดและที่ดิน (Location & Geo-Asset)
Feature: GPS Button:
Style: Massive Button, full width. Icon MapPin.
Label: "📍 กดปุ่มนี้เพื่อดึงพิกัดแปลงของท่าน"
Action: Simulate getting Lat/Long with a loading spinner.
Feature: Land Type Cards (Select One):
Card 1: Icon FileText (โฉนด/เจ้าของ)
Card 2: Icon FileSignature (สปก.)
Card 3: Icon Handshake (เช่า)
Inputs (Number): "พื้นที่ทั้งหมด (ไร่)", "พื้นที่พักดิน (ไร่)" (Important for Scalability).
Step 3: การผลิตและความเสี่ยง (Production & Risk)
Input: "พืชหลัก" (Dropdown with common Thai crops), "พืชรอง".
Feature: Water Risk Selector (Big Cards):
Card 1 (Green): 💧 "น้ำพอตลอดปี"
Card 2 (Orange): 🍂 "ขาดแคลนหน้าแล้ง"
Card 3 (Red): 🌊 "เสี่ยงน้ำท่วม"
Input: "คาดว่าจะเก็บเกี่ยวเดือนไหน" (Month Selector).
Step 4: มาตรฐานและความยั่งยืน (Standards & Green Asset)
Chemical Usage (Big Cards):
Card 1: 🌿 "ไม่ใช้เลย (อินทรีย์)" -> High Value
Card 2: 🛡️ "ใช้น้อย (GAP)"
Card 3: 🧪 "ใช้ปกติ"
Feature: Product Photo:
Label: "ถ่ายรูปผลผลิตของท่าน (โชว์ความสวยงาม)"
Feature: Carbon Credit Check:
Checkbox: "✅ ใช้วิธีไถกลบตอซัง (ไม่เผา)" -> Label with Green Leaf Icon.
Step 5: การสนับสนุนและปัญหา (Logistics & Pain Points)
Logistics: Checkbox "มีรถขนส่งเอง", "ต้องการรถมารับ", "มีห้องเย็น".
Financial: Input "เบอร์พร้อมเพย์ (สำหรับรับเงินสนับสนุน)".
Pain Points (Multi-select Chips): "ราคาตกต่ำ", "ศัตรูพืช", "ขาดแรงงาน", "หนี้สิน".
Text Area: "รายละเอียดเพิ่มเติม..." (With Voice Hint underneath).
C. Farmer Dashboard (Personal Asset View)
Passport Card:
Display: Farmer Photo, Name, ID.
QR Code: Generated from Farmer ID (Traceability Link).
Badge: "Platinum" (Gold) if Organic/No Chem, "Transition" (Blue), "Starter" (Gray).
Wealth Widget:
Calculation: (Total Area * Yield Estimate * Market Price)
Display: "มูลค่าผลผลิตคาดการณ์: ฿XXX,XXX" (Big Gold Font).
Weather Card: Simple 3-day forecast icon based on GPS.
D. Admin Command Center (War Room)
Layout: Dashboard Grid (Sidebar + Main Content).
Feature: The Master Map (Centerpiece):
Interactive Map of Thailand.
Pins: Color-coded pins (Green=Safe, Red=Risk).
Interaction: Clicking a province filters the charts below.
Widgets:
Supply Forecast: Bar Chart (X=Month, Y=Tons).
Risk Radar: Pie Chart showing % of farmers with "Water Risk".
Carbon Footprint: Number of farmers engaging in "No Burn" practices.
Live Feed: Grid of latest "Farm Photos" uploaded by farmers.
📊 4. Data Strategy & Mock Logic
Create a file mockData.ts to simulate a live database.
Farmer Interface:
id: string
name: string (Thai names e.g., "ลุงสมหมาย ใจสู้")
province: string
crop: string ("ข้าวหอมมะลิ", "ทุเรียน", "ผักสลัด")
risk_water: 'low' | 'drought' | 'flood'
chem_usage: 'none' | 'gap' | 'high'
practice_no_burn: boolean
image_url: string (placeholder)
lat: number, lng: number
Business Logic:
Badge Logic: IF chem_usage === 'none' AND practice_no_burn === true THEN Badge = Platinum.
Risk Alert: IF risk_water === 'drought' THEN Show Red Warning on Map.
📝 5. Implementation Prompt (Copy & Paste)
Use this specific instruction to generate the code:
"Generate a React application based on the Araya Agri-Wellness Mega Prompt.
Start by creating the Farmer Registration Wizard with the Stepper component.
Ensure all UI text is in THAI.
Implement the Big Card Selectors for the 'Water Risk' and 'Chemical Usage' steps immediately.
Use mockData.ts to populate the Admin Dashboard map and charts.
Focus on the 'Agri-Tech = Asset' visual style (Gold/Emerald colors)."

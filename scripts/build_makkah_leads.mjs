import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const outputPath = join(root, 'data', 'makkah-business-leads-batch-1.json');
const existing = JSON.parse(await readFile(outputPath, 'utf8'));
const TODAY = new Date().toISOString().slice(0, 10);

const boxes = [];
const latStops = [21.24, 21.295, 21.35, 21.405, 21.46, 21.515, 21.58];
const lonStops = [39.68, 39.735, 39.79, 39.845, 39.90, 39.955, 40.01, 40.065, 40.12];
for (let y = 0; y < latStops.length - 1; y += 1) {
  for (let x = 0; x < lonStops.length - 1; x += 1) {
    boxes.push([latStops[y], lonStops[x], latStops[y + 1], lonStops[x + 1]]);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decodeXml = (value) => String(value || '')
  .replaceAll('&quot;', '"').replaceAll('&apos;', "'").replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>').replaceAll('&amp;', '&');

function parseBusinessNodes(xml) {
  const output = [];
  const coordinates = new Map();
  const coordinatePattern = /<node\s+([^>]+?)(?:\s*\/?>)/g;
  const nodePattern = /<node\s+([^>]+)>([\s\S]*?)<\/node>/g;
  const wayPattern = /<way\s+([^>]+)>([\s\S]*?)<\/way>/g;
  const attrPattern = /(\w+)="([^"]*)"/g;
  const tagPattern = /<tag\s+k="([^"]+)"\s+v="([^"]*)"\s*\/>/g;
  const isRelevant = (tags) => {
    const relevantAmenity = /^(restaurant|cafe|fast_food|clinic|hospital|pharmacy|bank|dentist|doctors|veterinary|marketplace|car_rental|fuel|school|college|kindergarten|language_school)$/;
    const relevantTourism = /^(hotel|hostel|apartment|guest_house)$/;
    const relevantLeisure = /^(fitness_centre|sports_centre)$/;
    return Boolean(tags.name && (tags.shop || tags.office || tags.craft || relevantAmenity.test(tags.amenity || '') || relevantTourism.test(tags.tourism || '') || relevantLeisure.test(tags.leisure || '')));
  };
  for (const match of xml.matchAll(coordinatePattern)) {
    const attrs = Object.fromEntries([...match[1].matchAll(attrPattern)].map((item) => [item[1], decodeXml(item[2])]));
    if (attrs.id && attrs.lat && attrs.lon) coordinates.set(attrs.id, [Number(attrs.lat), Number(attrs.lon)]);
  }
  for (const match of xml.matchAll(nodePattern)) {
    const attrs = Object.fromEntries([...match[1].matchAll(attrPattern)].map((item) => [item[1], decodeXml(item[2])]));
    const tags = Object.fromEntries([...match[2].matchAll(tagPattern)].map((item) => [decodeXml(item[1]), decodeXml(item[2])]));
    if (!isRelevant(tags)) continue;
    output.push({ type: 'node', id: attrs.id, lat: Number(attrs.lat), lon: Number(attrs.lon), tags });
  }
  for (const match of xml.matchAll(wayPattern)) {
    const attrs = Object.fromEntries([...match[1].matchAll(attrPattern)].map((item) => [item[1], decodeXml(item[2])]));
    const tags = Object.fromEntries([...match[2].matchAll(tagPattern)].map((item) => [decodeXml(item[1]), decodeXml(item[2])]));
    if (!isRelevant(tags)) continue;
    const refs = [...match[2].matchAll(/<nd\s+ref="([^"]+)"\s*\/>/g)].map((item) => coordinates.get(item[1])).filter(Boolean);
    if (!refs.length) continue;
    const lat = refs.reduce((sum, point) => sum + point[0], 0) / refs.length;
    const lon = refs.reduce((sum, point) => sum + point[1], 0) / refs.length;
    output.push({ type: 'way', id: attrs.id, lat, lon, tags });
  }
  return output;
}

async function queryBox(box, boxIndex) {
  const [south, west, north, east] = box;
  const url = `https://api.openstreetmap.org/api/0.6/map?bbox=${west},${south},${east},${north}`;
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'NewMediaAgencyResearch/1.0 (business lead verification)' },
        signal: AbortSignal.timeout(90_000),
      });
      if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
      return parseBusinessNodes(await response.text());
    } catch (error) {
      lastError = error;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw new Error(`Box ${boxIndex + 1} failed: ${lastError?.message}`);
}

const districtCenters = [
  ['أجياد', 21.4164, 39.8297], ['المسفلة', 21.4038, 39.8207], ['المعابدة', 21.4386, 39.8504],
  ['العتيبية', 21.4435, 39.8174], ['الزاهر', 21.4495, 39.8006], ['النزهة', 21.4274, 39.7885],
  ['الرصيفة', 21.4074, 39.7868], ['الحمراء وأم الجود', 21.3973, 39.7790], ['العزيزية', 21.3963, 39.8721],
  ['الروضة', 21.4300, 39.8820], ['النسيم', 21.3667, 39.8848], ['العوالي', 21.3535, 39.8930],
  ['بطحاء قريش', 21.3600, 39.8350], ['الكعكية', 21.3760, 39.8050], ['الشوقية', 21.3850, 39.7900],
  ['ولي العهد', 21.3300, 39.8150], ['الهجرة', 21.3755, 39.8370], ['كدي', 21.3912, 39.8385],
  ['جبل النور', 21.4585, 39.8900], ['الشرائع', 21.4775, 39.9435], ['الراشدية', 21.4890, 39.9630],
  ['الجامعة', 21.3300, 39.9550], ['العمرة', 21.5000, 39.8000], ['التنعيم', 21.4900, 39.8250],
  ['البحيرات', 21.5200, 39.7600], ['الخضراء', 21.4600, 39.7750], ['الزايدي', 21.4300, 39.7200],
  ['الملك فهد', 21.3900, 39.7600], ['الروابي', 21.4025, 39.8790], ['ريع ذاخر', 21.4550, 39.8670],
];

function nearestDistrict(lat, lon) {
  let nearest = districtCenters[0];
  let best = Infinity;
  for (const district of districtCenters) {
    const distance = ((lat - district[1]) ** 2) + (((lon - district[2]) * Math.cos(lat * Math.PI / 180)) ** 2);
    if (distance < best) { best = distance; nearest = district; }
  }
  return nearest[0];
}

if (existing.length >= 1000) {
  const normalized = existing.slice(0, 1000).map((lead) => {
    const { latitude, longitude, ...record } = lead;
    return {
      ...record,
      neighborhood: Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))
        ? nearestDistrict(Number(latitude), Number(longitude))
        : lead.neighborhood,
    };
  });
  await writeFile(outputPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ total: normalized.length, normalized: true, neighborhoods: new Set(normalized.map((lead) => lead.neighborhood)).size }, null, 2));
  process.exit(0);
}

const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const first = (...values) => values.map(clean).find(Boolean) || '';

function classify(tags) {
  const type = tags.shop || tags.office || tags.amenity || tags.tourism || tags.craft || '';
  if (['restaurant', 'cafe', 'fast_food'].includes(type)) return ['مطاعم ومقاهي', 'مطعم أو مقهى', 1, 'تصوير ومحتوى قصير وإدارة حسابات وحملات زيارات محلية'];
  if (['hotel', 'hostel', 'apartment', 'guest_house'].includes(type)) return ['فنادق وضيافة', 'منشأة ضيافة', 1, 'موقع حجوزات ومحتوى تجربة وإعلانات بحث وسفر'];
  if (['clinic', 'hospital', 'pharmacy', 'dentist', 'doctors', 'optician', 'medical_supply'].includes(type)) return ['صحة وعيادات', 'منشأة صحية', 1, 'حضور ثقة ومحتوى تثقيفي وحجز مواعيد وحملات محلية'];
  if (['beauty', 'hairdresser', 'cosmetics', 'perfumery'].includes(type)) return ['تجميل وعناية', 'متجر أو مركز عناية', 1, 'هوية ومحتوى قبل وبعد وحجوزات وحملات محلية'];
  if (['estate_agent', 'property_management', 'architect', 'construction_company'].includes(type)) return ['عقار ومقاولات', 'شركة أو مكتب عقاري', 1, 'هوية مؤسسية ومحتوى مشاريع وموقع توليد عملاء'];
  if (['accountant', 'lawyer', 'consulting', 'financial', 'insurance', 'bank'].includes(type)) return ['خدمات مهنية ومالية', 'شركة أو مكتب خدمات', 1, 'موقع تعريفي ومحتوى ثقة وتوليد فرص أعمال'];
  if (['school', 'college', 'kindergarten', 'language_school', 'books', 'stationery'].includes(type)) return ['تعليم وتدريب', 'منشأة تعليمية', 2, 'حملات تسجيل ومحتوى تعليمي وموقع أو صفحة هبوط'];
  if (['car', 'car_repair', 'car_parts', 'tyres', 'fuel', 'car_rental'].includes(type)) return ['سيارات ونقل', 'منشأة سيارات', 2, 'محتوى عروض وحملات محلية وخرائط وواتساب'];
  if (['supermarket', 'convenience', 'mall', 'department_store', 'marketplace', 'clothes', 'shoes', 'jewelry', 'electronics', 'mobile_phone', 'furniture'].includes(type)) return ['تجزئة ومتاجر', 'متجر تجزئة', 2, 'إدارة حسابات وتصوير منتجات وعروض وحملات زيارات'];
  if (['fitness_centre', 'sports', 'sports_nutrition', 'gym'].includes(type)) return ['رياضة وعافية', 'مركز رياضي', 2, 'محتوى تحفيزي واشتراكات وحملات محلية'];
  return ['أنشطة وخدمات محلية', 'منشأة محلية', 3, 'تدقيق حضور رقمي وخطة محتوى وخدمة مناسبة حسب الاكتشاف'];
}

function completenessScore(lead) {
  return 45 + (lead.phone ? 18 : 0) + (lead.website ? 12 : 0) + (lead.address ? 8 : 0) + (lead.priority === 1 ? 12 : lead.priority === 2 ? 7 : 2);
}

const batches = [];
for (let index = 0; index < boxes.length; index += 3) {
  const group = boxes.slice(index, index + 3);
  const output = await Promise.all(group.map((box, offset) => queryBox(box, index + offset)));
  batches.push(...output.flat());
  process.stdout.write(`Fetched ${Math.min(index + 3, boxes.length)}/${boxes.length} areas\n`);
  if (batches.length >= 1800) break;
}

const existingNames = new Set(existing.map((lead) => clean(lead.name).toLocaleLowerCase('ar')));
const seenOsm = new Set();
const seenNames = new Set(existingNames);
const collected = [];

for (const element of batches) {
  const tags = element.tags || {};
  const name = first(tags['name:ar'], tags.name);
  const lat = Number(element.lat ?? element.center?.lat);
  const lon = Number(element.lon ?? element.center?.lon);
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
  const osmKey = `${element.type}/${element.id}`;
  const nameKey = name.toLocaleLowerCase('ar');
  if (seenOsm.has(osmKey) || seenNames.has(nameKey)) continue;
  seenOsm.add(osmKey); seenNames.add(nameKey);
  const [activity, category, priority, recommendedService] = classify(tags);
  const neighborhood = nearestDistrict(lat, lon);
  const street = first(tags['addr:street']);
  const house = first(tags['addr:housenumber']);
  const address = first([house, street].filter(Boolean).join('، '), `${neighborhood}، مكة المكرمة`);
  const phone = first(tags.phone, tags['contact:phone'], tags.mobile, tags['contact:mobile']);
  const email = first(tags.email, tags['contact:email']);
  const website = first(tags.website, tags['contact:website'], tags['contact:instagram'], tags['contact:facebook']);
  const lead = {
    neighborhood, name, category, phone, address, website, rating: '',
    maps_url: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
    activity, priority, score: 0, email, recommended_service: recommendedService,
    status: 'new', owner: '', outcome: 'not_contacted', last_contact_at: '', notes: '',
    researched_at: TODAY, source: `OpenStreetMap (${osmKey})`, latitude: lat, longitude: lon,
  };
  lead.score = Math.min(100, completenessScore(lead));
  collected.push(lead);
}

collected.sort((a, b) => a.priority - b.priority || b.score - a.score || a.neighborhood.localeCompare(b.neighborhood, 'ar') || a.name.localeCompare(b.name, 'ar'));
const required = Math.max(0, 1000 - existing.length);
if (collected.length < required) throw new Error(`Only ${collected.length} verified new businesses found; ${required} required.`);

const additions = collected.slice(0, required).map((lead, index) => ({
  ...lead,
  id: `MKB1-${String(existing.length + index + 1).padStart(4, '0')}`,
}));

const merged = [...existing, ...additions];
await writeFile(outputPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
const neighborhoods = new Set(merged.map((lead) => lead.neighborhood));
const withPhone = merged.filter((lead) => lead.phone).length;
const withWebsite = merged.filter((lead) => lead.website).length;
console.log(JSON.stringify({ total: merged.length, added: additions.length, neighborhoods: neighborhoods.size, withPhone, withWebsite }, null, 2));

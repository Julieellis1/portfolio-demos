/* ═══════════ Esriltor · shared listing data ═══════════ */
var ESRILTOR_LISTINGS = [
  {
    id: 1, slug: "14-palatine-road", mode: "sale",
    price: 685000, priceLabel: "£685,000",
    address: "14 Palatine Road", area: "Didsbury", postcode: "M20 2QH",
    fullArea: "Didsbury, Manchester M20",
    type: "Terrace", beds: 4, baths: 2, recep: 2, sqft: "1,842",
    img: "images/listing-terrace.jpg", interior: "images/interior-terrace.jpg",
    alt: "Victorian red-brick terraced house in Didsbury"
  },
  {
    id: 2, slug: "12-anchorage-quay", mode: "sale",
    price: 325000, priceLabel: "£325,000",
    address: "Apt 12, Anchorage Quay", area: "Salford Quays", postcode: "M50 3XJ",
    fullArea: "Salford Quays, M50",
    type: "Apartment", beds: 2, baths: 2, recep: 1, sqft: "894",
    img: "images/listing-apartment.jpg", interior: "images/interior-apartment.jpg",
    alt: "Modern apartment building at Salford Quays"
  },
  {
    id: 3, slug: "7-woodlands-road", mode: "sale",
    price: 1150000, priceLabel: "£1,150,000",
    address: "7 Woodlands Road", area: "Altrincham", postcode: "WA14 2TD",
    fullArea: "Altrincham, WA14",
    type: "Detached", beds: 5, baths: 4, recep: 3, sqft: "3,410",
    img: "images/listing-detached.jpg", interior: "images/interior-detached.jpg",
    alt: "Detached family house in Altrincham"
  },
  {
    id: 4, slug: "penthouse-3-deansgate", mode: "rent",
    price: 2400, priceLabel: "£2,400", per: "pcm",
    address: "Penthouse 3, No.1 Deansgate", area: "City Centre", postcode: "M3 2AY",
    fullArea: "City Centre, M3",
    type: "Penthouse", beds: 3, baths: 3, recep: 2, sqft: "1,976",
    img: "images/listing-penthouse.jpg", interior: "images/interior-penthouse.jpg",
    alt: "Luxury penthouse living room in Manchester city centre"
  },
  {
    id: 5, slug: "22-beech-road", mode: "sale",
    price: 495000, priceLabel: "£495,000",
    address: "22 Beech Road", area: "Chorlton", postcode: "M21 9EQ",
    fullArea: "Chorlton, Manchester M21",
    type: "Cottage", beds: 3, baths: 2, recep: 1, sqft: "1,204",
    img: "images/listing-cottage.jpg", interior: "images/interior-cottage.jpg",
    alt: "Stone cottage with front garden in Chorlton"
  },
  {
    id: 6, slug: "9-scholars-walk", mode: "rent",
    price: 1650, priceLabel: "£1,650", per: "pcm",
    address: "9 Scholars Walk", area: "New Islington", postcode: "M4 6DE",
    fullArea: "New Islington, M4",
    type: "Townhouse", beds: 3, baths: 3, recep: 2, sqft: "1,388",
    img: "images/listing-townhouse.jpg", interior: "images/interior-townhouse.jpg",
    alt: "Contemporary townhouses in New Islington"
  }
];

function bedIcon() {
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M2 17h20"/></svg>';
}
function bathIcon() {
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z"/><path d="M6 12V5a2 2 0 0 1 4 0"/><path d="M8 21l-1-2M16 21l1-2"/></svg>';
}
function areaIcon() {
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>';
}

/* Shared property card markup (links to the static detail page) */
function listingCardHTML(l) {
  var tag = l.mode === "sale" ? "For sale" : "To let";
  var tagCls = l.mode === "sale" ? "card-tag" : "card-tag let";
  var per = l.per ? " <small>" + l.per + "</small>" : "";
  return (
    '<article class="card">' +
    '<a class="card-media" href="' + l.slug + '.html" aria-label="View ' + l.address + '">' +
    '<img src="' + l.img + '" alt="' + l.alt + '" loading="lazy">' +
    '<span class="' + tagCls + '">' + tag + "</span></a>" +
    '<div class="card-body">' +
    '<p class="card-price">' + l.priceLabel + per + "</p>" +
    '<p class="card-address"><a href="' + l.slug + '.html">' + l.address + "</a></p>" +
    '<p class="card-area">' + l.fullArea + " · " + l.type + "</p>" +
    '<div class="card-specs"><span>' + bedIcon() + l.beds + " beds</span>" +
    "<span>" + bathIcon() + l.baths + " baths</span>" +
    "<span>" + areaIcon() + l.sqft + " sq ft</span></div>" +
    '<a class="card-link" href="' + l.slug + '.html">View details →</a>' +
    "</div></article>"
  );
}

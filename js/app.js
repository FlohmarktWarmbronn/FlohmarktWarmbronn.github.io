const currency = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
});

const germanDate = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const registrationDate = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin'
});

const setText = (key, value) => {
  document.querySelectorAll(`[data-config="${key}"]`).forEach((element) => {
    element.textContent = value;
  });
};

const setLink = (key, value) => {
  document.querySelectorAll(`[data-config-href="${key}"]`).forEach((element) => {
    element.href = value;
  });
};

const formatTime = (time) => `${time} Uhr`;

const seasonalImages = {
  spring: {
    hero: {
      src: 'assets/spring/36192600.jpg',
      alt: 'Bunter Kleidermarkt in einer europäischen Altstadt'
    },
    buyer: {
      src: 'assets/spring/6999379.jpg',
      alt: 'Stoffhase und Ostereier als frühlingshafte Spielsachen'
    },
    seller: {
      src: 'assets/spring/19295108.jpg',
      alt: 'Kleidung an einem Flohmarktstand im Park'
    }
  },
  autumn: {
    hero: {
      src: 'assets/autumn/18990779.jpg',
      alt: 'Kinder spielen mit Fahrzeugen zwischen bunten Herbstblättern'
    },
    buyer: {
      src: 'assets/autumn/6349542.jpg',
      alt: 'Kinder in Herbstkleidung spielen mit Spielsachen'
    },
    seller: {
      src: 'assets/autumn/16729590.jpg',
      alt: 'Kleidung an einem Flohmarktstand'
    }
  }
};

const setSeason = (eventDate) => {
  const month = eventDate.getMonth() + 1;
  const season = month >= 3 && month <= 5 ? 'spring' : 'autumn';

  document.body.dataset.season = season;
  document.querySelector('meta[name="theme-color"]').content = season === 'spring' ? '#176b57' : '#4d563e';
  document.querySelectorAll('[data-season-image]').forEach((image) => {
    const seasonalImage = seasonalImages[season][image.dataset.seasonImage];
    image.src = seasonalImage.src;
    image.alt = seasonalImage.alt;
  });
};

fetch('./config.json', { cache: 'no-store' })
  .then((response) => {
    if (!response.ok) throw new Error('Konfiguration nicht verfügbar');
    return response.json();
  })
  .then((config) => {
    const eventDate = new Date(`${config.eventDate}T12:00:00`);
    const dateText = germanDate.format(eventDate);
    const eventTime = `${config.eventTimeStart}–${config.eventTimeEnd} Uhr`;
    const signupText = registrationDate.format(new Date(config.registrationStart));
    const email = config.contactEmail;

    setSeason(eventDate);
    setText('event.day', String(eventDate.getDate()).padStart(2, '0'));
    setText('event.date', dateText);
    setText('event.time', eventTime);
    setText('event.entryTime', formatTime(config.eventTimeStart));
    setText('event.earlyEntryTime', formatTime(config.earlyEntryTime));
    setText('event.cakeTime', formatTime(config.cakeSaleTime));
    setText('registration.date', signupText);
    setText('fees.table', currency.format(config.tableFee));
    setText('fees.deposit', currency.format(config.depositFee));
    setText('fees.cake', currency.format(config.cakeFee));
    setText('contactEmail', email);
    setText('venue.name', config.venue);
    setText('venue.street', config.street);
    setText('venue.city', config.city);
    setLink('registrationUrl', config.registrationUrl);
    setLink('contactEmailHref', `mailto:${email}`);
  })
  .catch(() => {
    document.querySelector('[data-config-error]').hidden = false;
  });
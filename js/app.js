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
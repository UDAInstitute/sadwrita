export type ReaderCard = {
  readerName: string;
  readerEmail: string;
  readerSince: string;
  readerId: string;
};

const cardExistsKey = "readerCardExists";
const sequenceKey = "readerCardSequence";

function createReaderId() {
  const savedSequence = window.localStorage.getItem(sequenceKey);
  let sequence = savedSequence === null ? 127 : Number(savedSequence);

  if (!Number.isSafeInteger(sequence) || sequence < 127) {
    throw new Error("The Reader's Card sequence is invalid.");
  }

  const previousId = window.localStorage.getItem("readerId");
  const previousSequence = previousId?.match(/^RC-(\d{6})$/);
  if (previousSequence) {
    sequence = Math.max(sequence, Number(previousSequence[1]) + 1);
  }

  if (sequence > 999999) {
    throw new Error("No local Reader's Card IDs remain in this sequence.");
  }

  window.localStorage.setItem(sequenceKey, String(sequence + 1));
  return `RC-${String(sequence).padStart(6, "0")}`;
}

function normalizeReaderId(readerId: string) {
  if (/^RC-\d{6}$/.test(readerId)) {
    return readerId;
  }

  const nextId = createReaderId();
  window.localStorage.setItem("readerId", nextId);
  return nextId;
}

export function getReaderCard(): ReaderCard | null {
  if (window.localStorage.getItem(cardExistsKey) !== "true") {
    return null;
  }

  const readerEmail = window.localStorage.getItem("readerEmail");
  const readerSince = window.localStorage.getItem("readerSince");
  const storedReaderId = window.localStorage.getItem("readerId");

  if (
    !readerEmail ||
    !readerSince ||
    Number.isNaN(Date.parse(readerSince)) ||
    !storedReaderId
  ) {
    throw new Error("The stored Reader's Card is incomplete.");
  }

  return {
    readerName: window.localStorage.getItem("readerName") ?? "",
    readerEmail,
    readerSince,
    readerId: normalizeReaderId(storedReaderId),
  };
}

export function saveReaderCard(card: ReaderCard): ReaderCard {
  const savedCard = {
    readerName: card.readerName.trim(),
    readerEmail: card.readerEmail.trim(),
    readerSince: card.readerSince,
    readerId: card.readerId,
  };

  if (
    !savedCard.readerEmail ||
    !/^RC-\d{6}$/.test(savedCard.readerId) ||
    Number.isNaN(Date.parse(savedCard.readerSince))
  ) {
    throw new Error("The issued Reader's Card details are invalid.");
  }

  window.localStorage.setItem("readerName", savedCard.readerName);
  window.localStorage.setItem("readerEmail", savedCard.readerEmail);
  window.localStorage.setItem("readerSince", savedCard.readerSince);
  window.localStorage.setItem("readerId", savedCard.readerId);
  window.localStorage.setItem(cardExistsKey, "true");

  return savedCard;
}

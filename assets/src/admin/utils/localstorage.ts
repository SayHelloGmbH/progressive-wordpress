const LOCALSTORAGE_KEYS = {
  CARDS: 'pwp-cards-closed',
};

const getClosedCards = (): string =>
  localStorage.getItem(LOCALSTORAGE_KEYS.CARDS) || '';

export const isCardClosed = (key: string): boolean =>
  getClosedCards().split(',').indexOf(key) !== -1;

export const setCardClosed = (key: string, closed: boolean): void => {
  let openCards = getClosedCards().split(',');
  const isClosed = isCardClosed(key);

  if (isClosed && !closed) {
    openCards = openCards.filter((e) => e !== key);
  } else if (!isClosed && closed) {
    openCards = [...openCards, key];
  }

  localStorage.setItem(
    LOCALSTORAGE_KEYS.CARDS,
    openCards.filter((e) => Boolean(e)).join(',')
  );
};

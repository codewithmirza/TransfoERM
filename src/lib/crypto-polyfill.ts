if (typeof window !== 'undefined' && !window.crypto) {
  window.crypto = {
    getRandomValues: function (buffer: Uint8Array) {
      return crypto.getRandomValues(buffer)
    },
  } as Crypto
}

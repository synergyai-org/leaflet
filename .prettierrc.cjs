const SORT_EXT = ['jpe?g|png|svg', 's?css'];

module.exports = {
  singleQuote: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    `^[#\\.](?![A-z])(?!.*\\.(${SORT_EXT.join('|')})$).*`,
    ...SORT_EXT.map((ext) => `^.*\\.(?=(${ext})$)`),
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  overrides: [
    {
      files: '*.yml',
      options: {
        singleQuote: false,
      },
    },
  ],
};

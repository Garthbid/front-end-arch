# BiddingWar

This is the official repository for the GarthBid "Bidding War" platform.

## Deployment

Deployed on Vercel.

## Fonts

- **Headings**: Uses **Integral CF** (Heavy Italic).
  - File: `/public/fonts/IntegralCF-HeavyItalic.otf`
  - Fallback: **Montserrat** (Google Fonts, Black Italic 900)
- **Body**: Uses **Inter** (Google Fonts).

### Troubleshooting Font Issues
If the font appears thin or incorrect:
1. Ensure the `.otf` file is in `public/fonts/`.
2. Check that the `@font-face` rule in `index.html` points to the correct path.
3. The fallback `Montserrat` should look very similar (Bold/Italic).

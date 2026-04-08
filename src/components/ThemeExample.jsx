// Example component demonstrating theme usage
import {
  Button,
  Card,
  CardContent,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { colors } from "@/theme";

export default function ThemeExample() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section with Gradient */}
      <section className="gradient-accent py-20 px-4 text-white">
        <div className="container-max">
          <h1 className="font-heading text-5xl font-bold mb-4">
            Business Selling Made Easy
          </h1>
          <p className="text-lg text-neutral-100 mb-8 max-w-2xl">
            Connect, explore, and transact with confidence on our professional
            marketplace
          </p>
          <button className="btn-primary">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="font-heading text-4xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-600 text-xl">🔒</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-neutral-900">
                Secure Transactions
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                All transactions are encrypted and verified to ensure your
                safety
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-secondary-600 text-xl">📊</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-neutral-900">
                Real-time Analytics
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Track your listings performance with comprehensive analytics
                dashboard
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-success-600 text-xl">🚀</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-neutral-900">
                Quick Growth
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Reach thousands of active buyers and sellers worldwide instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section with MUI Components */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-md">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            List Your Business
          </h2>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Business Name" fullWidth variant="outlined" />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
            />

            <Button variant="contained" color="primary" size="large">
              Submit Listing
            </Button>
          </Box>
        </div>
      </section>

      {/* Color Palette Showcase */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Color Palette
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {["primary", "secondary", "success", "warning", "error"].map(
              (colorName) => (
                <div key={colorName} className="text-center">
                  <div
                    className="h-24 rounded-lg mb-2 shadow-md"
                    style={{ backgroundColor: colors[colorName][500] }}
                  />
                  <p className="capitalize font-semibold text-neutral-700">
                    {colorName}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Button Variants */}
      <section className="section-padding bg-neutral-100">
        <div className="container-max">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Button Styles
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="contained" color="primary">
              Primary
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="outlined" color="primary">
              Outlined
            </Button>
            <Button variant="text" color="primary">
              Text
            </Button>
            <button className="btn-primary">Tailwind Primary</button>
            <button className="btn-secondary">Tailwind Secondary</button>
            <button className="btn-outline">Tailwind Outline</button>
            <button className="btn-ghost">Tailwind Ghost</button>
          </div>
        </div>
      </section>

      {/* Typography Showcase */}
      <section className="section-padding">
        <div className="container-max max-w-2xl">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Typography System
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-neutral-600 uppercase tracking-wider mb-2">
                Heading 1
              </p>
              <h1>The quick brown fox jumps over the lazy dog</h1>
            </div>

            <div>
              <p className="text-sm text-neutral-600 uppercase tracking-wider mb-2">
                Heading 2
              </p>
              <h2>The quick brown fox jumps over the lazy dog</h2>
            </div>

            <div>
              <p className="text-sm text-neutral-600 uppercase tracking-wider mb-2">
                Body Text
              </p>
              <p>
                The quick brown fox jumps over the lazy dog. This is example
                body text that should be highly readable and comfortable for
                extended reading. Uses the Inter font for optimal legibility.
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-600 uppercase tracking-wider mb-2">
                Caption Text
              </p>
              <small>
                This is small caption text, useful for secondary information and
                labels
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* MUI Components Showcase */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-2xl">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            MUI Components
          </h2>

          <div className="space-y-4">
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  This is a MUI Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Material-UI components automatically use the theme colors and
                  typography
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

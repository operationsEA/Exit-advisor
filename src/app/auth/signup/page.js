import { Box, Grid, Container } from "@mui/material";
import SignupLeft from "@/components/Auth/SignupLeft";
import SignupRight from "@/components/Auth/SignupRight";

export const metadata = {
  title: "Sign Up - BizForSale.io",
  description:
    "Create your account and start buying or selling businesses today.",
};

export default function SignupPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Grid container sx={{ minHeight: "100vh" }}>
        {/* Left Section */}
        <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
          <SignupLeft />
        </Grid>

        {/* Right Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Container
            maxWidth="sm"
            sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}
          >
            <SignupRight />
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}

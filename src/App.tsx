
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AnalysisResults from "./pages/AnalysisResults";
import DemoAnalysis from "./pages/DemoAnalysis";
import UploadContract from "./pages/UploadContract";
import Legal from "./pages/Legal";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import WerteEthik from "./pages/WerteEthik";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analyse-ergebnisse" element={<AnalysisResults />} />
          <Route path="/demo-analyse" element={<DemoAnalysis />} />
          <Route path="/vertrag-hochladen" element={<UploadContract />} />
          <Route path="/rechtliches" element={<Legal />} />
          <Route path="/kontakt" element={<Contact />} />
          
          {/* New routes */}
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/werte-ethik" element={<WerteEthik />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/analysis-results" element={<AnalysisResults />} />
          <Route path="/demo-analysis" element={<DemoAnalysis />} />
          <Route path="/upload-contract" element={<UploadContract />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

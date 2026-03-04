import '@walletconnect/react-native-compat'; // MUST BE LINE 1
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

// --- WEB3 IMPORTS ---
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal, Web3Modal, defaultWagmiConfig } from '@web3modal/wagmi-react-native';
import { polygonAmoy } from 'viem/chains';
// --------------------

import LandingScreen from './screen/LandingScreen';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import FarmerDashboard from './screen/FarmerDashboard';
import PlotRegistrationScreen from './screen/PlotRegistrationScreen';
import AdminDashboard from './screen/AdminDashboard';
import GeoCaptureScreen from "./screen/GeoCaptureScreen";
import MyPlots from "./screen/MyPlotsScreen";
import RecordFieldData from "./screen/RecordFieldDataScreen";
import ManagePlots from "./screen/ManagePlotsScreen";
import ManageFarmers from "./screen/ManageFarmerScreen";
import CarbonReportsScreen from "./screen/CarbonReportsScreen";
import MarketplaceDashboard from "./screen/MarketplaceDashboard";
import MarketplaceUsersScreen from "./screen/MarketplaceUsersScreen";
import SystemSettingsScreen from "./screen/SystemSettingsScreen";
import VerificationScreen from "./screen/VerificationScreen";
import BlockchainScreen from "./screen/BlockchainScreen";

const Stack = createStackNavigator();

// ─── WEB3 SETUP ──────────────────────────────────────────────────────────────
// All of this lives OUTSIDE the component and runs ONCE per JS bundle load.
// Using a guard prevents re-initialization on Expo/Metro hot reloads.

const projectId =
  process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c04bd26c04f98124b89e3a31c51db3f0';

const metadata = {
  name: 'Veriflow',
  description: 'Carbon Credit NFT Marketplace',
  url: 'https://veriflow.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: { native: 'veriflow://' },
};

// Freeze the config so React/Wagmi never sees a "new" object reference
const wagmiConfig = defaultWagmiConfig({
  chains: [polygonAmoy],
  projectId,
  metadata,
});

// QueryClient must also be a stable singleton
const queryClient = new QueryClient();

// Guard: only call createWeb3Modal once even across hot reloads
if (!global._web3ModalInitialized) {
  createWeb3Modal({ projectId, wagmiConfig });
  global._web3ModalInitialized = true;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AppNavigator() {
  return (
    <WagmiProvider config={wagmiConfig}>  {/* ← prop is "config", not "wagmiConfig" */}
      <QueryClientProvider client={queryClient}>

        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing"            component={LandingScreen}          options={{ headerShown: false }} />
          <Stack.Screen name="Login"              component={LoginScreen}            options={{ headerShown: false }} />
          <Stack.Screen name="Register"           component={RegisterScreen}         options={{ headerShown: false }} />
          <Stack.Screen name="FarmerDashboard"    component={FarmerDashboard}        options={{ headerShown: false }} />
          <Stack.Screen name="PlotRegistration"   component={PlotRegistrationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminDashboard"     component={AdminDashboard}         options={{ headerShown: false }} />
          <Stack.Screen name="GeoCapture"         component={GeoCaptureScreen}       options={{ headerShown: false }} />
          <Stack.Screen name="MyPlots"            component={MyPlots}                options={{ headerShown: false }} />
          <Stack.Screen name="RecordFieldData"    component={RecordFieldData}        options={{ headerShown: false }} />
          <Stack.Screen name="ManagePlots"        component={ManagePlots}            options={{ headerShown: false }} />
          <Stack.Screen name="ManageFarmers"      component={ManageFarmers}          options={{ headerShown: false }} />
          <Stack.Screen name="CarbonReportsScreen" component={CarbonReportsScreen}  options={{ headerShown: false }} />
          <Stack.Screen name="Marketplace"        component={MarketplaceDashboard}   options={{ headerShown: false }} />
          <Stack.Screen name="MarketplaceUsers"   component={MarketplaceUsersScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SystemSettings"     component={SystemSettingsScreen}   options={{ headerShown: false }} />
          <Stack.Screen name="Verification"       component={VerificationScreen}     options={{ headerShown: false }} />
          <Stack.Screen name="BlockchainScreen"   component={BlockchainScreen}       options={{ headerShown: false }} />
        </Stack.Navigator>

        <Web3Modal />

      </QueryClientProvider>
    </WagmiProvider>
  );
}
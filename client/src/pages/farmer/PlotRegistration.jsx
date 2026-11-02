import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, MapPin, Check, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import SatelliteMap from '../../components/maps/SatelliteMap';
import GlassCard from '../../components/shared/GlassCard';
import apiClient from '../../config/api';
import { MANGROVE_SPECIES } from '../../config/constants';
import { useWeb3 } from '../../context/Web3Context';

export default function PlotRegistration() {
  const navigate = useNavigate();
  const { account } = useWeb3();

  const [formData, setFormData] = useState({
    title: '',
    species: MANGROVE_SPECIES[0].name,
    area_hectares: 5.0,
    latitude: 21.9497,
    longitude: 89.1833,
    region_name: 'Sundarbans Biosphere Reserve, West Bengal',
    farmer_wallet: account || '0x71C83D431a89c9d4b009FE543477F5B648834465',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Sync wallet when connected
  React.useEffect(() => {
    if (account) {
      setFormData((prev) => ({ ...prev, farmer_wallet: account }));
    }
  }, [account]);

  const handleCoordinatesSelected = (coords) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'area_hectares' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Please provide a descriptive title for your mangrove plot.');
      return;
    }
    if (formData.area_hectares <= 0) {
      setError('Plantation area must be greater than 0 hectares.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        species: formData.species,
        area_hectares: formData.area_hectares,
        latitude: formData.latitude,
        longitude: formData.longitude,
        region_name: formData.region_name,
      };

      const res = await apiClient.post('/plots', payload);
      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/farmer');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSpeciesDetails = MANGROVE_SPECIES.find((s) => s.name === formData.species);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* Back button and page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/farmer')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Zero-Image Geospatial Plot Registration</span>
          </h1>
          <p className="text-xs text-slate-400">
            Pinpoint your coastal mangrove restoration plot on the satellite map to begin automated MRV.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 flex items-center gap-2 text-sm">
          <Check className="w-5 h-5 text-emerald-400" />
          <span>Mangrove plot registered successfully with status <strong>SUBMITTED</strong>! Redirecting to dashboard...</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Interactive Satellite Map + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Satellite Map */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <GlassCard className="p-4">
            <SatelliteMap
              initialLat={formData.latitude}
              initialLng={formData.longitude}
              areaHectares={formData.area_hectares}
              onSelectCoordinates={handleCoordinatesSelected}
              height="460px"
              title="Click anywhere to capture plot latitude & longitude"
            />
          </GlassCard>

          {/* Selected Species Card */}
          {selectedSpeciesDetails && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                <span>{selectedSpeciesDetails.name} ({selectedSpeciesDetails.commonName})</span>
                <span className="font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Sf = {selectedSpeciesDetails.woodDensityFactor}
                </span>
              </div>
              <p className="text-slate-400">{selectedSpeciesDetails.description}</p>
            </div>
          )}
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Plantation Plot Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Sundarbans Block 4 Blue Carbon"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Dominant Mangrove Species
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  {MANGROVE_SPECIES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({s.commonName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Area (Hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    name="area_hectares"
                    value={formData.area_hectares}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Region Name
                  </label>
                  <input
                    type="text"
                    name="region_name"
                    value={formData.region_name}
                    onChange={handleChange}
                    placeholder="e.g. Sundarbans, WB"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Coordinates (Synced from Map) */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Latitude</span>
                  <input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-emerald-400 font-mono text-xs font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Longitude</span>
                  <input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-emerald-400 font-mono text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Farmer Payout Wallet Address */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Farmer Settlement Wallet (Polygon Amoy)
                </label>
                <input
                  type="text"
                  name="farmer_wallet"
                  value={formData.farmer_wallet}
                  onChange={handleChange}
                  placeholder="0x..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  All MATIC marketplace sales are forwarded directly to this wallet address.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-obsidian-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Plot to Registry...</span>
                  </>
                ) : (
                  <>
                    <Sprout className="w-4 h-4" />
                    <span>Submit Mangrove Plot for MRV Verification</span>
                  </>
                )}
              </button>

            </form>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}

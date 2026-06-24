import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../api/apiClient';
import type { ICommonParameterDto, ICommonParametersState } from '../../types/commonParameters';

interface CommonParametersProps {
  userId: string;
  values: ICommonParametersState;
  onChange: (updatedValues: ICommonParametersState) => void;
  onError: (errorMsg: string) => void;
  onlyConsumer?: boolean; // 🚀 ফিক্স ১: শুধুমাত্র কনজ্যুমার চ্যানেল দেখানোর জন্য নতুন ফ্ল্যাগ প্রপ্স
}

export const CommonParameters = ({
  userId,
  values,
  onChange,
  onError,
  onlyConsumer = false // ডিফল্ট ফলস থাকবে যেন অন্য রিপোর্টে সব চ্যানেল দেখায়
}: CommonParametersProps) => {
  const [channels, setChannels] = useState<ICommonParameterDto[]>([]);
  const [zones, setZones] = useState<ICommonParameterDto[]>([]);
  const [divisions, setDivisions] = useState<ICommonParameterDto[]>([]);
  const [areas, setAreas] = useState<ICommonParameterDto[]>([]);
  const [territories, setTerritories] = useState<ICommonParameterDto[]>([]);

  const handleInternalError = useCallback((err: unknown) => {
    console.error(err);
    if (err && typeof err === 'object' && 'response' in err) {
      const responseObj = (err as any).response;
      if (responseObj && responseObj.data) {
        onError(responseObj.data.error || responseObj.data.message || "Procedure failed.");
        return;
      }
    }
    onError("Failed to load parameters from server.");
  }, [onError]);

  // ১. চ্যানেলের ডাটা লোড ও কন্ডিশনাল ফিল্টারিং
  useEffect(() => {
    if (userId) {
      apiClient.get<ICommonParameterDto[]>( `/CommonParameters/channels/${userId}`)
        .then((res) => {
          // 🚀 ফিক্স ২: প্রপ্স ট্রু হলে এপিআই থেকে আসা ডাটা ফিল্টার করে শুধু Consumer (id: 1) রাখবে
          if (onlyConsumer) {
            const filtered = res.data.filter(c => c.id === 1 || c.name?.toLowerCase() === 'consumer');
            setChannels(filtered);
          } else {
            setChannels(res.data);
          }
        })
        .catch(handleInternalError);
    }
  }, [userId, onlyConsumer, handleInternalError]);

  // ২. জোন ডাটা লোড
  useEffect(() => {
    if (userId && values.channelId) {
      apiClient.get<ICommonParameterDto[]>(`/CommonParameters/zones/${userId}/${values.channelId}`)
        .then((res) => setZones(res.data))
        .catch(handleInternalError);
    } else {
      setZones([]);
    }
  }, [userId, values.channelId, handleInternalError]);

  // ৩. ডিভিশন ডাটা লোড
  useEffect(() => {
    if (userId && values.zoneId) {
      apiClient.get<ICommonParameterDto[]>(`/CommonParameters/divisions/${userId}/${values.zoneId}`)
        .then((res) => setDivisions(res.data))
        .catch(handleInternalError);
    } else {
      setDivisions([]);
    }
  }, [userId, values.zoneId, handleInternalError]);

  // ৪. এরিয়া ডাটা লোড
  useEffect(() => {
    if (userId && values.divisionId) {
      apiClient.get<ICommonParameterDto[]>(`/CommonParameters/areas/${userId}/${values.divisionId}`)
        .then((res) => setAreas(res.data))
        .catch(handleInternalError);
    } else {
      setAreas([]);
    }
  }, [userId, values.divisionId, handleInternalError]);

  // ৫. টেরিটোরি ডাটা লোড
  useEffect(() => {
    if (userId && values.areaId) {
      apiClient.get<ICommonParameterDto[]>(`/CommonParameters/territories/${userId}/${values.areaId}`)
        .then((res) => setTerritories(res.data))
        .catch(handleInternalError);
    } else {
      setTerritories([]);
    }
  }, [userId, values.areaId, handleInternalError]);

  const handleSelectChange = (field: keyof ICommonParametersState, value: number | '') => {
    const updated = { ...values, [field]: value };

    if (field === 'channelId') {
      updated.zoneId = '';
      updated.divisionId = '';
      updated.areaId = '';
      updated.territoryId = '';
    } else if (field === 'zoneId') {
      updated.divisionId = '';
      updated.areaId = '';
      updated.territoryId = '';
    } else if (field === 'divisionId') {
      updated.areaId = '';
      updated.territoryId = '';
    } else if (field === 'areaId') {
      updated.territoryId = '';
    }

    onChange(updated);
  };

  return (
    <>
      {/* Channel Select */}
      <div className="flex-1 w-full flex flex-col gap-1">
        <label htmlFor="channel-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Channel</label>
        <select 
          id="channel-select"
          title="Select Channel"
          value={values.channelId} 
          onChange={(e) => handleSelectChange('channelId', e.target.value ? Number(e.target.value) : '')}
          className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate box-border"
        >
          <option value="">-- Select Channel --</option>
          {channels.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Zone Select */}
      <div className="flex-1 w-full flex flex-col gap-1">
        <label htmlFor="zone-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Zone</label>
        <select 
          id="zone-select"
          title="Select Zone"
          value={values.zoneId} 
          onChange={(e) => handleSelectChange('zoneId', e.target.value ? Number(e.target.value) : '')} 
          disabled={!values.channelId}
          className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 truncate box-border"
        >
          <option value="">-- Select Zone --</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>{z.name}</option>
          ))}
        </select>
      </div>

      {/* Division Select */}
      <div className="flex-1 w-full flex flex-col gap-1">
        <label htmlFor="division-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Division</label>
        <select 
          id="division-select"
          title="Select Division"
          value={values.divisionId} 
          onChange={(e) => handleSelectChange('divisionId', e.target.value ? Number(e.target.value) : '')} 
          disabled={!values.zoneId}
          className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 truncate box-border"
        >
          <option value="">-- Select Division --</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Area Select */}
      <div className="flex-1 w-full flex flex-col gap-1">
        <label htmlFor="area-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Area</label>
        <select 
          id="area-select"
          title="Select Area"
          value={values.areaId} 
          onChange={(e) => handleSelectChange('areaId', e.target.value ? Number(e.target.value) : '')} 
          disabled={!values.divisionId}
          className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 truncate box-border"
        >
          <option value="">-- Select Area --</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Territory Select */}
      <div className="flex-1 w-full flex flex-col gap-1">
        <label htmlFor="territory-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Territory</label>
        <select 
          id="territory-select"
          title="Select Territory"
          value={values.territoryId} 
          onChange={(e) => handleSelectChange('territoryId', e.target.value ? Number(e.target.value) : '')} 
          disabled={!values.areaId}
          className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 truncate box-border"
        >
          <option value="">-- Select Territory --</option>
          {territories.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
    </>
  );
};
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../api/apiClient';
import type { ICommonParameterDto, ICommonParametersState } from '../../types/commonParameters';

interface CommonParametersProps {
  userId: string;
  values: ICommonParametersState;
  onChange: (updatedValues: ICommonParametersState) => void;
  onError: (errorMsg: string) => void;
  onlyConsumer?: boolean;
}

export const CommonParameters = ({
  userId,
  values,
  onChange,
  onError,
  onlyConsumer = false
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
        const apiErrorMsg = responseObj.data.error || JSON.stringify(responseObj.data);
        
        // Connection timeout message checking sequence with server
        if (apiErrorMsg && apiErrorMsg.includes("Connection request timed out")) {
          onError("Opps! Failed to connect with server");
        } else {
          onError(responseObj.data.error || responseObj.data.message || "Procedure failed to load data");
        }
        return;
      }
    }
    // 👇 Server totally unmapped ba server string breakdown fallback block
    onError("Opps! Failed to connect with server.");
  }, [onError]);

  useEffect(() => {
    if (userId) {
      apiClient.get<ICommonParameterDto[]>( `/CommonParameters/channels/${userId}`)
        .then((res) => {
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

  useEffect(() => {
    if (userId && values.channelId) {
      apiClient.get<ICommonParameterDto[]>(`/CommonParameters/zones/${userId}/${values.channelId}`)
        .then((res) => setZones(res.data))
        .catch(handleInternalError);
    } else {
      setZones([]);
    }
  }, [userId, values.channelId, handleInternalError]);

  useEffect(() => {
    if (userId && values.zoneId) {
      apiClient.get<ICommonParameterDto[]>(`/CommonParameters/divisions/${userId}/${values.zoneId}`)
        .then((res) => setDivisions(res.data))
        .catch(handleInternalError);
    } else {
      setDivisions([]);
    }
  }, [userId, values.zoneId, handleInternalError]);

  useEffect(() => {
    if (userId && values.divisionId) {
      apiClient.get<ICommonParameterDto[]>(`/CommonParameters/areas/${userId}/${values.divisionId}`)
        .then((res) => setAreas(res.data))
        .catch(handleInternalError);
    } else {
      setAreas([]);
    }
  }, [userId, values.divisionId, handleInternalError]);

  useEffect(() => {
    if (userId && values.areaId) {
      apiClient.get<ICommonParameterDto[]>(`/CommonParameters/territories/${userId}/${values.areaId}`)
        .then((res) => setTerritories(res.data))
        .catch(handleInternalError);
    } else {
      setDivisions([]);
    }
  }, [userId, values.areaId, handleInternalError]);

  const handleSelectChange = (field: keyof ICommonParametersState, value: number | '') => {
    const updated = { ...values, [field]: value };
    if (field === 'channelId') {
      updated.zoneId = ''; updated.divisionId = ''; updated.areaId = ''; updated.territoryId = '';
    } else if (field === 'zoneId') {
      updated.divisionId = ''; updated.areaId = ''; updated.territoryId = '';
    } else if (field === 'divisionId') {
      updated.areaId = ''; updated.territoryId = '';
    } else if (field === 'areaId') {
      updated.territoryId = '';
    }
    onChange(updated);
  };

  return (
    <>
   {/* <div className="grid grid-cols-5 items-end gap-1 w-full"> */}
      {/* Channel Select */}
      <div className="w-full flex flex-col">
        <label htmlFor="channel-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Channel</label>
        <select 
          id="channel-select" 
          title="Select Channel" 
          value={values.channelId} 
          onChange={(e) => handleSelectChange('channelId', e.target.value ? Number(e.target.value) : '')} 
          className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full h-[30px] 
          focus:outline-none focus:border-blue-500 bg-white truncate box-border cursor-pointer">
          <option value="">--Select--</option>
          {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Zone Select */}
      <div className="w-full flex flex-col">
        <label htmlFor="zone-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Zone</label>
        <select 
          id="zone-select" 
          title="Select Zone" 
          value={values.zoneId} 
          onChange={(e) => handleSelectChange('zoneId', e.target.value ? Number(e.target.value) : '')} 
          disabled={!values.channelId} 
          className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
          h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
          disabled:text-slate-400 truncate box-border cursor-pointer">
          <option value="">--Select--</option>
          {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
      </div>

      {/* Division Select */}
      <div className="w-full flex flex-col">
        <label htmlFor="division-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Division</label>
        <select 
          id="division-select" 
          title="Select Division" 
          value={values.divisionId} 
          onChange={(e) => handleSelectChange('divisionId', e.target.value ? Number(e.target.value) : '')} 
          disabled={!values.zoneId} 
          className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
          h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
          disabled:text-slate-400 truncate box-border cursor-pointer">
          <option value="">--Select--</option>
          {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Area Select */}
      <div className="w-full flex flex-col">
        <label htmlFor="area-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Area</label>
        <select 
          id="area-select" 
          title="Select Area" 
          value={values.areaId} 
          onChange={(e) => handleSelectChange('areaId', e.target.value ? Number(e.target.value) : '')} 
          disabled={!values.divisionId} 
          className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
          h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
          disabled:text-slate-400 truncate box-border cursor-pointer">
          <option value="">--Select--</option>
          {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      {/* Territory Select */}
      <div className="w-full flex flex-col">
        <label htmlFor="territory-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Territory</label>
        <select 
          id="territory-select" 
          title="Select Territory" 
          value={values.territoryId} 
          onChange={(e) => handleSelectChange('territoryId', e.target.value ? Number(e.target.value) : '')} 
          disabled={!values.areaId} 
          className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
          h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
          disabled:text-slate-400 truncate box-border cursor-pointer">
          <option value="">--Select--</option>
          {territories.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
    {/* </div> */}
    </>
  );
};
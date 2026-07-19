import { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { OptionsOrGroups, GroupBase } from 'react-select';
import { useLazyGetChannelDistributorQuery } from '../../services/ChannelDistributorApi';

interface ChannelDistributorOption {
  value: number;
  label: string;
}

interface ChannelDistributorSelectProps {
  channelId: number;
  userId: string;
  value: number;
  onChange: (value: number) => void;
  onError: (errorMsg: string) => void;
}

interface AdditionalPageParam {
  page: number;
}

export const ChannelDistributorSelect = ({ channelId, userId, value, onChange, onError, }: ChannelDistributorSelectProps) => {

  const [getDistributors] = useLazyGetChannelDistributorQuery();

  const [selectedOption, setSelectedOption] =
    useState<ChannelDistributorOption>({
      value: 0,
      label: '-- All Distributors --',
    });


  const loadOptions = async (
    search: string,
    _loadedOptions: OptionsOrGroups<
      ChannelDistributorOption,
      GroupBase<ChannelDistributorOption>
    >,
    additional?: AdditionalPageParam
  ) => {

    const page = additional?.page ?? 1;

    try {

      const response = await getDistributors({
        channelId: channelId === 0 ? null : channelId,
        userId,
        search: search.trim(),
        page,
        pageSize: 50,
      }).unwrap();

      const options: ChannelDistributorOption[] =
        response.items.map(item => ({
          value: item.id,
          label: item.name,
        }));

      // Edit mode / existing value hoile selected name set korbe
      if (value !== 0) {
        const selected = options.find(
          item => item.value === value
        );
        if (selected) {
          setSelectedOption(selected);
        }
      }


      return {
        options:
          page === 1
            ? [
                {
                  value: 0,
                  label: '-- All Distributors --',
                },
                ...options,
              ]
            : options,
        hasMore: response.hasMore,
        additional: {
          page: page + 1,
        },
      };
    } 
    catch {
      onError('Opps! Failed to connect with server');
      return {
        options: [],
        hasMore: false,
        additional: {
          page: 1,
        },
      };
    }
  };


  const handleChange = (
    option: ChannelDistributorOption | null
  ) => {
    const selected =
      option ?? {
        value: 0,
        label: '-- All Distributors --',
      };
    setSelectedOption(selected);
    onChange(selected.value);
  };


  return (

    <div className="w-full flex flex-col">
      <label
        htmlFor="channel-distributor-select"
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Distributor
      </label>

      <AsyncPaginate<
        ChannelDistributorOption,
        GroupBase<ChannelDistributorOption>,
        AdditionalPageParam
      >
        id="channel-distributor-select"
        value={selectedOption}
        loadOptions={loadOptions}
        onChange={handleChange}
        additional={{
          page: 1,
        }}
        cacheUniqs={[
          channelId,
          userId,
        ]}
        debounceTimeout={300}
        isSearchable={true}
        placeholder="Search distributor..."
        className="text-[11px] font-semibold w-full"
        styles={{
          control: (base) => ({
            ...base,
            height: '30px',
            minHeight: '30px',
            borderColor: '#cbd5e1',
            borderRadius: '0.375rem',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
          }),
          option: (base) => ({
            ...base,
            fontSize: '11px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '4px',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 35,
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 35,
          }),
        }}
      />
    </div>
  );
};
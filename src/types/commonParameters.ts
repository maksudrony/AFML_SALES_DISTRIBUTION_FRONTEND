export interface ICommonParameterDto {
  id: number;
  name: string;
}

export interface ICommonParametersState {
  channelId: number | '';
  zoneId: number | '';
  divisionId: number | '';
  areaId: number | '';
  territoryId: number | '';
}
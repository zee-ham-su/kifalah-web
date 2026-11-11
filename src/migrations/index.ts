import * as migration_20261111_125058_initial from './20261111_125058_initial';

export const migrations = [
  {
    up: migration_20261111_125058_initial.up,
    down: migration_20261111_125058_initial.down,
    name: '20261111_125058_initial'
  },
];

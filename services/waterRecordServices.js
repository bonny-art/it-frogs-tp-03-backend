import {WaterRecord} from ("../db/models/WaterRecord");

export const waterRecordServices = async (params) => {
    return await WaterRecord.findOne({params})
  };

 
import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { ClientSession } from "mongoose";
import { ClientError } from "../middleware/errors";
import { dbDateTime } from "../utils/time";
import { ModelInsert } from "../utils/types";
import { EPinSchema } from "./schemas/epin.schema";

class EPin extends EPinSchema {
  isActive() {
    return this.status === "active";
  }

  validateStatus() {
    const isActive = this.isActive();
    if (!isActive) {
      throw ClientError(`E-Pin ${this.ePin} has been used already`);
    }
  }

  async expireStatus(
    this: DocumentType<EPin>,
    userId: number,
    session: ClientSession
  ) {
    this.status = "expired";
    if (!this.assignedTo) this.assignedTo = userId;
    this.registeredBy = userId;
    this.activatedAt = dbDateTime();
    await this.save({ session });
  }
}

export type EPinInsert = ModelInsert<EPin>;
const EPinModel = getModelForClass(EPin);
export default EPinModel;

/**
 * create ePin instance
 */
export const getEPinInstance = async (ePin: string, error?: string) => {
  const _ePin = await EPinModel.findOne({ ePin });
  if (!_ePin) throw ClientError(error || `${ePin} E-Pin not found`);

  return _ePin;
};

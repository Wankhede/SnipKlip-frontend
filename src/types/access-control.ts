import { KeyAttributes } from "match-sorter";
import { MetaDataAttributeI } from "./common";

export interface AccessKeyAssociation{
    id?: number;
    group: string;
    salon_id: string;
    branch_id:string;
    subscription_name: string;
  }
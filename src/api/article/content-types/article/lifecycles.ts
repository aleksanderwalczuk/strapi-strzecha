import type { Event } from "@strapi/database/dist/lifecycles/";
import axios from "axios";
import { omit } from "lodash";

interface LifecycleEvent extends Event {
  result: {
    id: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: null | string;
    title: string;
    uid: string;
    content: string;
  };
}

export default {
  async afterCreate(event: LifecycleEvent) {
    event;
    const url = `${process.env.CONTENT_API_URL}/content`;
    const { result, params } = event;

    const res = await axios.post(
      url,
      JSON.stringify(omit(result, ["createdBy", "updatedBy"]))
    );
  },
  async afterUpdate(event: LifecycleEvent) {
    const url = `${process.env.CONTENT_API_URL}/content`;
    const { result, params } = event;

    if (event.result.publishedAt == null) {
      return axios.delete(url, {
        params: {
          id: result.uid,
        },
      });
    }

    console.log("UPDATE");

    return axios.put(
      url,
      JSON.stringify(omit(result, ["createdBy", "updatedBy"]))
    );
  },
};

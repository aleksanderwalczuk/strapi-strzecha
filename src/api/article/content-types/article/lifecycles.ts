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
    if (process.env.CONTENT_API_URL) {
      const url = `${process.env.CONTENT_API_URL}/content`;
      const { result, params } = event;

      const res = await axios.post(
        url,
        omit(result, ["createdBy", "updatedBy"])
      );
    }
  },
  async afterUpdate(event: LifecycleEvent) {
    if (process.env.CONTENT_API_URL) {
      const url = `${process.env.CONTENT_API_URL}/content`;
      const { result } = event;

      if (event.result.publishedAt == null) {
        return axios.delete(url, {
          params: {
            id: `${event.result.id}.${event.result.uid}`,
          },
        });
      }

      return axios.put(url, omit(result, ["createdBy", "updatedBy"]));
    }
  },
  async afterDelete(event: LifecycleEvent) {
    if (process.env.CONTENT_API_URL) {
      const url = `${process.env.CONTENT_API_URL}/content`;

      return axios.delete(url, {
        params: {
          id: `${event.result.id}.${event.result.uid}`,
        },
      });
    }
  },
};

import { StrapiImageInterface } from "./StrapiImageInterface";

interface CrudEntries {
  createdAt: string
  updatedAt: string
  publishedAt: string
}
export interface ParentCategory extends CrudEntries {
  name: string
  uid: string
  id: number
}

export interface CategoryInterface extends CrudEntries {
  id: number
  name: string
  uid: string
  onHomepage: boolean
  parentCategory: Pick<ParentCategory, "uid">
  image?: StrapiImageInterface
  order?: number
}

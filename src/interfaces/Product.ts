import { CategoryInterface } from "./CategoryInterface";
import { StrapiImageInterface } from "./StrapiImageInterface";

interface CurrencyInterface {
  isBeforePrice: boolean
  name: string
  symbol: string
  id: number
}

interface Provider {
  name: string
  label?: string
  url: string
}

export interface ProductInterface {
  createdAt: string
  publishedAt: string
  updatedAt: string
  title: string
  uid: string
  id: number
  price: number
  description: string
  images: StrapiImageInterface[]
  category: CategoryInterface
  currency: CurrencyInterface
  providers: Provider[]
}

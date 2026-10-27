import type { Metadata } from "next";
import { StayPage } from "@/components/stay/StayPage";
import { wedding } from "@/content/wedding";

const { partnerOne, partnerTwo } = wedding.couple;

export const metadata: Metadata = {
  title: `${wedding.lodging.title}: ${partnerOne.firstName} & ${partnerTwo.firstName}`,
  description: `Hotels near the ${wedding.couple.weddingName} celebrations in ${wedding.venue.name}, Cameroon.`,
};

export default function Stay() {
  return <StayPage />;
}

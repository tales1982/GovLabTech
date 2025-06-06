"use client";
import { Avatar, Card, ListContainer, Name } from "@/styles/DeputyList";

type Deputy = {
  firstname: string;
  name: string;
  photo: string;
};

type Props = {
  deputies: Deputy[];
  onSelect: (fullName: string) => void;
};

export default function DeputyList({ deputies, onSelect }: Props) {
  return (
    <ListContainer>
      {deputies.map((dep, index) => (
        <Card key={index} onClick={() => onSelect(`${dep.firstname} ${dep.name}`)}>
          <Avatar src={dep.photo} alt={`${dep.firstname} ${dep.name}`} />
          <Name>
            {dep.firstname} {dep.name}
          </Name>
        </Card>
      ))}
    </ListContainer>
  );
}

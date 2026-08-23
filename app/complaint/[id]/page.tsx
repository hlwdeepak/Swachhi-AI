import { ComplaintDetail } from './ComplaintDetail';

export function generateStaticParams() {
  return [
    { id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }, { id: 'c5' },
    { id: 'c6' }, { id: 'c7' }, { id: 'c8' }, { id: 'c9' }, { id: 'c10' },
    { id: 'c11' }, { id: 'c12' }, { id: 'c13' }, { id: 'c14' }, { id: 'c15' },
    { id: 'demo' },
  ];
}

export default function ComplaintPage({ params }: { params: { id: string } }) {
  return <ComplaintDetail id={params.id} />;
}

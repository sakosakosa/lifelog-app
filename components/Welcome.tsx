type WelcomeProps = {
  name: string;
};

export default function Welcome({ name }: WelcomeProps) {
  return <h2>ようこそ {name} さん！</h2>;
}
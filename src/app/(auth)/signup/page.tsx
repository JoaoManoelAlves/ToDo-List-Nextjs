import { SignUpButton } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Cria sua conta no TaskUp</h1>
        <p className="text-muted-foreground">E começe a produzir.</p>
      </div>
      <SignUpButton/>
    </div>
  );
}
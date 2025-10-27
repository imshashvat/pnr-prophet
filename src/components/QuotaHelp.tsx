import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

export function QuotaHelp() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge variant="outline" className="cursor-help ml-2">What's this?</Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm">
        <div className="font-semibold mb-1">Quota types</div>
        <ul className="list-disc ml-4 space-y-1">
          <li><b>GNWL</b>: General Waitlist from the train origin; typically clears earlier.</li>
          <li><b>RLWL</b>: Remote Location Waitlist; depends on allocations for your boarding segment.</li>
          <li><b>PQWL</b>: Pooled Quota Waitlist; shared across segments, often lower priority.</li>
          <li><b>TQWL</b>: Tatkal Waitlist; short-notice quota, tends to be harder to clear.</li>
        </ul>
        <div className="mt-2 text-muted-foreground">Your route and boarding affect how each quota behaves.</div>
      </HoverCardContent>
    </HoverCard>
  );
}

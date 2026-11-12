import type { Control, FieldValues, Path } from 'react-hook-form';
import { Link } from 'wouter';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

// Explicit consent for every public form (Ghana Data Protection Act, 2012, Act 843).
// The form's zod schema must include: consent: z.boolean().refine((v) => v, 'Please tick the box to continue')
export function ConsentField<T extends FieldValues>({ control }: { control: Control<T> }) {
  return (
    <FormField
      control={control}
      name={'consent' as Path<T>}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <FormControl>
            <Checkbox checked={Boolean(field.value)} onCheckedChange={field.onChange} className="mt-1" />
          </FormControl>
          <div className="space-y-1 leading-snug">
            <FormLabel className="font-normal text-gray-700">
              I agree that Kifalah Foundation Ghana may store and use the details I have given to respond to me, as explained in the{' '}
              <Link href="/privacy" className="font-medium text-emerald-700 underline">Privacy Notice</Link>.
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

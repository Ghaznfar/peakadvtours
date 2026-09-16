'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { Button } from '@/components/ui/Button';

/**
 * Mobile navigation drawer. Client island — manages open state and uses Radix
 * Dialog for an accessible modal (focus trap, Escape to close, focus return,
 * `aria-modal`). Sub-menus use native <details> for accessible disclosure.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="focus-visible:ring-brand-600 inline-flex size-11 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:outline-none lg:hidden"
        >
          <Menu aria-hidden className="size-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in fixed inset-0 z-50 bg-slate-900/50" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl focus:outline-none"
          aria-label="Site menu"
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <Dialog.Title className="font-display text-base font-semibold text-slate-900">
              {siteConfig.name}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="focus-visible:ring-brand-600 inline-flex size-11 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:outline-none"
              >
                <X aria-hidden className="size-6" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="flex flex-col gap-1">
              {siteConfig.nav.map((item) =>
                item.children ? (
                  <li key={item.href}>
                    <details className="group rounded-lg">
                      <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                        {item.label}
                        <span
                          aria-hidden
                          className="text-slate-400 transition-transform group-open:rotate-180"
                        >
                          ▾
                        </span>
                      </summary>
                      <ul className="mt-1 flex flex-col gap-0.5 pb-2 pl-3">
                        <li>
                          <Link
                            href={item.href}
                            onClick={close}
                            className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            All {item.label.toLowerCase()}
                          </Link>
                        </li>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={close}
                              className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="border-t border-slate-200 p-4">
            <Button asChild fullWidth>
              <Link href="/contact" onClick={close}>
                Enquire now
              </Link>
            </Button>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/[^\d+]/g, '')}`}
              className="mt-3 block text-center text-sm text-slate-600"
            >
              {siteConfig.contact.phone}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

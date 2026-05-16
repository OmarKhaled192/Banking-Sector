import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _count = signal(0);

  readonly isLoading = computed(() => this._count() > 0);

  start(): void {
    this._count.update(current => current + 1);
  }

  stop(): void {
    this._count.update(current => Math.max(0, current - 1));
  }
}

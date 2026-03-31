import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from './appwrite.service';
import { ID } from 'appwrite';

export interface User {
  $id: string;
  name: string;
  email: string;
  prefs: { role?: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.prefs?.role === 'admin');
  userName = computed(() => this.currentUser()?.name || '');

  constructor(
    private appwrite: AppwriteService,
    private router: Router
  ) {
    this.checkSession();
  }

  async checkSession(): Promise<User | null> {
    try {
      const user = await this.appwrite.account.get() as unknown as User;
      this.currentUser.set(user);
      return user;
    } catch {
      this.currentUser.set(null);
      return null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    await this.appwrite.account.createEmailPasswordSession(email, password);
    const user = await this.appwrite.account.get() as unknown as User;
    this.currentUser.set(user);
    return user;
  }

  async register(name: string, email: string, password: string): Promise<User> {
    await this.appwrite.account.create(ID.unique(), email, password, name);
    await this.appwrite.account.createEmailPasswordSession(email, password);
    await this.appwrite.account.updatePrefs({ role: 'cliente' });
    const user = await this.appwrite.account.get() as unknown as User;
    this.currentUser.set(user);
    return user;
  }

  async logout(): Promise<void> {
    try {
      await this.appwrite.account.deleteSession('current');
    } catch { /* ignore */ }
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  async updateProfile(name: string): Promise<void> {
    await this.appwrite.account.updateName(name);
    await this.checkSession();
  }
}

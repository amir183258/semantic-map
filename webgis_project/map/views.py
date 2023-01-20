from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout

def login_page(request):
    if request.method == "GET":
        form = AuthenticationForm
        return render(request, "login.html", {"form":form})
    elif request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(username=username, password=password)

        if user is not None:
            form = login(request, user)
            return redirect("map")
        else:
            return redirect("login_page")

def map(request):
    if request.user.is_authenticated:
        return render(request, "map.html", {"user":request.user})
    else:
        return redirect("login_page")

def logout_page(request):
    logout(request)
    return redirect("login_page")
